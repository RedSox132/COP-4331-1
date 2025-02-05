<?php

// testing something for Chrome
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$inData = getRequestInfo(); # gets data from json file

$login = "";
$password = "";

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); # connect to db

# ensure connection worked
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
    exit();
}

# ensure data is properly inserted
if (!isset($inData["login"], $inData["password"])) {
    returnWithError("Missing required fields");
    exit();
}

# assign data to vars
$login = $inData["login"];
$password = $inData["password"];

# query the database to fetch the hashed password
$stmt = $conn->prepare("SELECT ID, firstName, lastName, password FROM Users WHERE login = ?");
$stmt->bind_param("s", $login);
$stmt->execute();
$result = $stmt->get_result();

# if no user found
if ($result->num_rows === 0) {
    returnWithError("User not found");
} else {
    $user = $result->fetch_assoc();
    $storedHashedPassword = $user["password"]; # hashed password from DB

    # verify the entered password against the stored hash
    if (password_verify($password, $storedHashedPassword)) {
        # if password is correct, return user info (without password)
        returnWithInfo($user["ID"], $user["firstName"], $user["lastName"], $login);
    } else {
        returnWithError("Incorrect password");
    }
}

$stmt->close();
$conn->close();

# helper functions
function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"id":0,"firstName":"","lastName":"","login":"","password":"","error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($id, $firstName, $lastName, $login)
{
    $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . 
                '","login":"' . $login . '","error":""}';
    sendResultInfoAsJson($retValue);
}

?>