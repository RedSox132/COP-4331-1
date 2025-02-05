<?php

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");

    
    # get user id
    $inData = getRequestInfo();
    $userId = $inData["userId"];

    # connect to db
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
        exit();
	} 
	else
	{
        # return json object with all contacts where id = userid
        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE UserId = ?");
        $stmt->bind_param("i",$userId);
        $stmt->execute();

        $result = $stmt->get_result();
        if ($result->num_rows > 0)
        {
            $contacts = array();
            while ($row = $result->fetch_assoc())
            {
                $contacts[] = $row;
            }
            
            returnWithData($contacts);
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

    function returnWithData($data)
    {
        $retValue = json_encode(array("results" => $data, "error" => ""));
        sendResultInfoAsJson($retValue);
    }
?>