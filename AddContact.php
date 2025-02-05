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
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
        exit();
	} 
	else
	{
        # Prepare and execute the SQL statement
        $stmt = $conn->prepare("INSERT into Contacts (UserId,FirstName,LastName,Phone,Email) VALUES(?,?,?,?,?)");
		$stmt->bind_param("issss", $userId, $firstName, $lastName, $phone, $email);
		$stmt->execute();
        
        if ($stmt->error) {
            returnWithError($stmt->error);
        } else {
            returnWithError("");
        }

        $stmt->close();
		$conn->close();
        exit();
    }

    function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

    function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }
?>