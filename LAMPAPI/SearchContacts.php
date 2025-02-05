<?php

	header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
	
	$inData = getRequestInfo();
	
	$searchResults = [];
	$searchCount = 0;

	# connect to db
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		# filter db based on search term
		$stmt = $conn->prepare("
            SELECT ID, FirstName, LastName, Phone, Email  
            FROM Contacts
            WHERE (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?)
            AND UserID = ?");

        $searchTerm = "%" . $inData["search"] . "%";
        $stmt->bind_param("ssssi", $searchTerm, $searchTerm, $searchTerm, $searchTerm, $inData["userId"]);
		$stmt->execute();
		$result = $stmt->get_result();

		# put results into array of json objects
        while($row = $result->fetch_assoc()) {
            $searchResults[] = $row;
        }

		# return results
        sendResultInfoAsJson($searchResults);
		
		$stmt->close();
		$conn->close();
    }

    function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo json_encode($obj);
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>