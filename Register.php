<?php

	// testing something
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");

    $inData = getRequestInfo(); # gets data from json file

    $firstName = "";
    $lastName = "";
    $login = "";
    $password = "";

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); # connect to db

    # ensure connection worked
    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
        exit();
    } 

    # ensure data is properly inserted
    if (!isset($inData["firstName"], $inData["lastName"], $inData["login"], $inData["password"])) {
        returnWithError("Missing required fields");
        exit();
    }    

    # assign data to vars
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $login = $inData["login"];
    $password = $inData["password"];

    # verify that the login does not already exist
    $stmt = $conn->prepare("SELECT ID FROM Users WHERE login = ?");
    $stmt->bind_param("s", $inData["login"]);
    $stmt->execute();
    $result = $stmt->get_result();

    # if exists, return with error. else, insert into users
    if ($result->num_rows > 0) {
        returnWithError("User already exists");
    } else {
        $stmt = $conn->prepare("INSERT INTO Users (firstName, lastName, login, password) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
        $stmt->execute();

        $id = $conn->insert_id; # get the id from db

        if ($stmt->error) {
            returnWithError($stmt->error);
        } else {
            returnWithInfo($id, $firstName, $lastName, $login, $password);
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

    function returnWithInfo($id, $firstName, $lastName, $login, $password)
    {
        $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . 
                    '","login":"' . $login . '","password":"' . $password . '","error":""}';
        sendResultInfoAsJson($retValue);
    }

?>