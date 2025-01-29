<?php
    // testing something
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    // Get request data sent to the server in JSON format and decode it into an associative array
    $inData = getRequestInfo();
    
    // Initialize variables to hold user information
    $id = 0;
    $firstName = "";
    $lastName = "";

    // Create a connection to the MySQL database
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

    // Check if the connection to the database failed
    if( $conn->connect_error )
    {
        // Return an error message if the connection fails
        returnWithError( $conn->connect_error );
    }
    else
    {
        // Prepare an SQL statement to select user information based on login and password
        $stmt = $conn->prepare("SELECT ID,FirstName,LastName FROM Users WHERE Login=? AND Password =?");
        
        // Bind parameters from the input data (login and password) to the prepared SQL statement
        $stmt->bind_param("ss", $inData["login"], $inData["password"]);
        
        // Execute the SQL statement
        $stmt->execute();
        
        // Fetch the result set from the executed statement
        $result = $stmt->get_result();

        // Check if any record was found
        if( $row = $result->fetch_assoc() )
        {
            // Return the user information if a matching record is found
            returnWithInfo( $row['FirstName'], $row['LastName'], $row['ID'] );
        }
        else
        {
            // Return an error message if no matching records are found
            returnWithError("No Records Found");
        }

        // Close the statement and the database connection
        $stmt->close();
        $conn->close();
    }

    // Function to retrieve JSON data from the HTTP request body
    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    // Function to send a JSON response back to the client
    function sendResultInfoAsJson( $obj )
    {
        header('Content-type: application/json'); // Set the response content type to JSON
        echo $obj; // Output the JSON object
    }

    // Function to return an error response in JSON format
    function returnWithError( $err )
    {
        // Create a JSON object with an error message and empty user information
        $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue ); // Send the JSON object as a response
    }

    // Function to return user information in JSON format
    function returnWithInfo( $firstName, $lastName, $id )
    {
        // Create a JSON object with user information and no error message
        $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
        sendResultInfoAsJson( $retValue ); // Send the JSON object as a response
    }
?>