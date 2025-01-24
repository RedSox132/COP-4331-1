<?php
    $inData = getRequestInfo();

    $contactId = $inData["contactId"];

    # connect to db
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError( $conn->connect_error );
        exit();
    } 
    else
    {
        # tell sql to delete by ID
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ?");

        if (!$stmt) {
            returnWithError("Prepare failed: " . $conn->error);
            $conn->close();
            exit();
        }

        # execute
        $stmt->bind_param("i", $contactId);
        $stmt->execute();

        if ($stmt->error) {
            returnWithError($stmt->error);
        } else {
            returnWithError("");
        }

        $stmt->close();
        $conn->close();
    }

    # helper functions
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