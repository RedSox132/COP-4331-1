<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$inData = getRequestInfo();

# ensure data is all required fields were filled out
if (!isset($inData["userId"], $inData["firstName"], $inData["lastName"], $inData["phone"], $inData["email"])) {
    returnWithError("Missing required fields");
    exit();
}

# assign to variables
$userId = $inData["userId"];
$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$phone = $inData["phone"];
$email = $inData["email"];

# connect to db
$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
    exit();
} else {
    # Prepare and execute the SQL statement to insert the new contact
    $stmt = $conn->prepare("INSERT INTO Contacts (UserId, FirstName, LastName, Phone, Email) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("issss", $userId, $firstName, $lastName, $phone, $email);
    $stmt->execute();

    if ($stmt->error) {
        returnWithError($stmt->error);
    } else {
        # After insertion, fetch the last inserted contact's ID
        $contactId = $stmt->insert_id;  // Get the auto-generated contact ID

        # Prepare the response with contact details
        $response = array(
            "contactId" => $contactId,
            "firstName" => $firstName,
            "lastName" => $lastName,
            "phone" => $phone,
            "email" => $email
        );

        # Return the contact data in the response
        returnWithData($response);
    }

    $stmt->close();
    $conn->close();
    exit();
}

function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

function returnWithError($err) {
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo $obj;
}

function returnWithData($data) {
    $retValue = json_encode(array("results" => $data, "error" => ""));
    sendResultInfoAsJson($retValue);
}
?>
