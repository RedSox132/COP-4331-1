<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");

    $inData = getRequestInfo();

    if (!isset($inData["userId"], $inData["firstName"], $inData["lastName"], $inData["phone"], $inData["email"])) {
        returnWithError("Missing required fields");
        exit();
    }

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phone = $inData["phone"];
    $email = $inData["email"];
    $userId = $inData["userId"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
        exit();
    } else {
        // ✅ Find the highest UserID and increment it manually
        $stmt = $conn->prepare("SELECT MAX(UserID) FROM Contacts");
        $stmt->execute();
        $stmt->bind_result($maxUserID);
        $stmt->fetch();
        $stmt->close();

        // If there are no existing users, start from 1
        $newUserID = ($maxUserID === NULL) ? 1 : $maxUserID + 1;

        // ✅ Insert new contact with incremented UserID
        $stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $newUserID);
        $stmt->execute();

        if ($stmt->error) {
            returnWithError($stmt->error);
        } else {
            returnWithError("");  // Success
        }

        $stmt->close();
        $conn->close();
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
?>