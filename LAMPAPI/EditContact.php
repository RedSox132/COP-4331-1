<?php

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    
    # get info
    $inData = getRequestInfo();

    # assign to vars
    $contactId = $inData["contactId"];
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
    } else {
        # update db
        $stmt = $conn->prepare("UPDATE Contacts 
                                SET FirstName=?, LastName=?, Phone=?, Email=? 
                                WHERE ID=?");
        
        $stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $contactId);
        $stmt->execute();

        if ($stmt->error) {
            returnWithError($stmt->error);
        } else {
            returnWithInfo($contactId,$firstName,$lastName,$phone,$email);
        }

        $stmt->close();
		$conn->close();
        exit();
    }

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

    function returnWithInfo($contactId, $firstName, $lastName, $phone, $email)
    {
        $retValue = '{"contactId":' . $contactId . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . 
                    '","phone":"' . $phone . '","email":"' . $email . '","error":""}';
        sendResultInfoAsJson($retValue);
    }
?>