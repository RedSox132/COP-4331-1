const urlBase = 'http://jacoblegler-cop4331.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin() {
    userId = 0;
    firstName = "";
    lastName = "";

    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;

    if (!login || !password) {
        document.getElementById("loginResult").innerHTML = "Please enter both username and password.";
        return;
    }

    let tmp = { login: login, password: password };
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                userId = jsonObject.id;
                if (userId < 1) {
                    document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();
                window.location.href = "contact.html"; // Redirect after saving the cookie
            } else {
                document.getElementById("loginResult").innerHTML = "Error: Unable to connect to the API.";
            }
        }
    };

    try {
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("loginResult").innerHTML = "An error occurred: " + err.message;
    }
}



function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));  // Set cookie expiry
    document.cookie = `firstName=${firstName},lastName=${lastName},userId=${userId};expires=${date.toGMTString()}`;
}

function readCookie() {
    userId = -1;  // Default value for userId
    let data = document.cookie;
    let splits = data.split(",");
    for (var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        }
        else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        }
        else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    // Check if the user is logged in, if not redirect to login page
    if (userId < 0) {
        if (window.location.pathname !== "/index.html" && window.location.pathname !== "/login.html" && window.location.pathname !== "/signup.html") {
            window.location.href = "index.html";  // Redirect to login if user is not logged in
        }
    } else {
        // Display the logged-in user's name on the page
        document.getElementById("userName").innerHTML = "Welcome " + firstName + " " + lastName + "!";
        loadContacts(); // Load contacts after reading the cookie
    }
}


function doSignup() {
    /*console.log("doLogin triggered");
    console.log("urlBase:", urlBase);
    console.log("Login API URL:", urlBase + '/Login.' + extension);*/




    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let login = document.getElementById("login").value;
    let password = document.getElementById("password").value;

    document.getElementById("signupResult").innerHTML = "";

    if (!firstName || !lastName || !login || !password) {
        document.getElementById("signupResult").innerHTML = "*Please fill out all fields.";
        return;
    }
    if (password.length < 8 || password.length > 32) {
        document.getElementById("signupResult").innerHTML = "*Passwords must be between 8 and 32 characters.";
        return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        document.getElementById("signupResult").innerHTML = "*Password must contain at least one special character.";
        return;
    }
    if (!/\d/.test(password)) {
        document.getElementById("signupResult").innerHTML = "*Password must contain at least one number.";
        return;
    }
    if (!/[A-Z]/.test(password)) {
        document.getElementById("signupResult").innerHTML = "*Password must contain at least one capital letter.";
        return;
    }


    //console.log("Login data:", { login, password });

    let tmp = { firstName: firstName, lastName: lastName, login: login, password: password };
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/Register.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (this.readyState != 4) {
            return;
        }
        if (this.status === 200) {
            let jsonObject = JSON.parse(xhr.responseText);
            userId = jsonObject.id;
            document.getElementById("signupResult").innerHTML = "user added";
            firstName = jsonObject.firstName;
            lastName = jsonObject.lastName;


            saveCookie();
            window.location.href = "login.html"; // Redirect on successful sign up
        } else {
            document.getElementById("signupResult").innerHTML = "Error: Unable to connect to the API.";
            console.error("Error Response:", xhr.responseText);
        }

    };

    try {
        xhr.send(jsonPayload);
        console.log("Request sent with payload:", jsonPayload);
    } catch (err) {
        document.getElementById("loginResult").innerHTML = "An error occurred: " + err.message;
        console.error("Request error:", err);
    }
}


function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}



function addContact() {
    let contactFirstName = document.getElementById("contactFirstName").value;
    let contactLastName = document.getElementById("contactLastName").value;
    let contactEmail = document.getElementById("contactEmail").value;
    let contactPhone = document.getElementById("contactPhone").value;

    document.getElementById("contactAddResult").innerHTML = "";

    if (!contactFirstName || !contactLastName || !contactEmail || !contactPhone) {
        document.getElementById("contactAddResult").innerHTML = "Please fill out all contact fields.";
        return;
    }

    let tmp = {
        firstName: contactFirstName,
        lastName: contactLastName,
        email: contactEmail,
        phone: contactPhone,
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let jsonResponse = JSON.parse(xhr.responseText);
                console.log("API Response: ", jsonResponse);  // Log the response to ensure contactId is being returned

                if (jsonResponse.results) {
                    let contact = jsonResponse.results;

                    document.getElementById("contactAddResult").innerHTML = "Contact has been added.";
                    // Immediately append the new contact to the table
                    addContactToTable(contact.contactId, contact.firstName, contact.lastName, contact.email, contact.phone);
					

                    // Reset input fields after successful contact addition
                    document.getElementById("contactFirstName").value = '';
                    document.getElementById("contactLastName").value = '';
                    document.getElementById("contactEmail").value = '';
                    document.getElementById("contactPhone").value = '';
					loadContacts();
                } else {
                    document.getElementById("contactAddResult").innerHTML = "Error adding contact: " + jsonResponse.error;
                }
            } else if (this.readyState === 4) {
                document.getElementById("contactAddResult").innerHTML = "Error adding contact.";
                console.error("API response error:", xhr.responseText); // Log any error response
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactAddResult").innerHTML = err.message;
        console.error("Error:", err.message);
    }
}

function addContactToTable(contactId, firstName, lastName, email, phone) {
    let tableBody = document.getElementById("contactsTableBody");
    let newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td>${firstName} ${lastName}</td>
        <td>${phone}</td>
        <td>${email}</td>
        <td>
            <button class="btn btn-warning btn-sm" onclick="openEditContactModal('${contactId}', '${firstName}', '${lastName}', '${email}', '${phone}')">Edit</button>
			
        </td>
		
    `;
	
    newRow.setAttribute("id", `contact-${contactId}`);
    tableBody.appendChild(newRow);
}


function loadContacts() {
    if (userId < 1) {
        document.getElementById("contactsTable").innerHTML = "Please log in to view your contacts.";
        return;
    }

    let tmp = {
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Contacts.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                console.log(jsonObject);  // Log the entire response

                if (jsonObject.results && jsonObject.results.length > 0) {
                    let tableBody = document.getElementById("contactsTableBody");
                    tableBody.innerHTML = ''; // Clear the table body

                    // Populate the table with the retrieved contacts
                    jsonObject.results.forEach((contact) => {
                        console.log(contact);  // Log each contact object to check the structure
						console.log("AGAIN" , contact.ID);
                        let row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${contact.FirstName || 'N/A'} ${contact.LastName || 'N/A'}</td>
                            <td>${contact.Phone || 'N/A'}</td>
                            <td>${contact.Email || 'N/A'}</td>
                            <td>
                                <button class="btn btn-warning btn-sm" onclick="openEditContactModal('${contact.ID}', '${contact.FirstName}', '${contact.LastName}', '${contact.Email}', '${contact.Phone}', this)">Edit</button>
								<button class="btn btn-warning btn-sm" onclick="deleteContact('${contact.ID}')">Delete</button>
								
                            </td>
                        `;
                        row.setAttribute("id", `contact-${contact.contactId}`);
                        tableBody.appendChild(row);
                    });
                } else {
                    document.getElementById("contactsTable").innerHTML = "No contacts found.";
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
        document.getElementById("contactsTable").innerHTML = "Error loading contacts.";
    }
}





// Function to search for contacts
function searchContacts() {
    // Get the search term, convert it to lowercase for case-insensitive search
    let searchTerm = document.getElementById('searchContacts').value.toLowerCase();

    // Get all contact rows
    let rows = document.querySelectorAll('#contactsTableBody tr');

    // Loop through each row
    rows.forEach((row) => {
        // Get the contact's first and last names (first two columns)
        let firstName = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
        let lastName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        
        // Check if all characters in searchTerm are present in either the first or last name
        let isMatch = true;
        
        // Check first and last name for each character in searchTerm
        for (let char of searchTerm) {
            if (!(firstName.includes(char) || lastName.includes(char))) {
                isMatch = false;
                break; // Exit loop if the character is not found in either name
            }
        }

        // Show or hide the row based on the match
        if (isMatch) {
            row.style.display = ''; // Show the row if it matches
        } else {
            row.style.display = 'none'; // Hide the row if it doesn't match
        }
    });
}


// Function to edit a contact
function editContact() {
    // Retrieve updated contact details from input fields.
    // Ensure your HTML has these IDs:
    // - contactIdEdit (the unique id of the contact to be edited)
    // - contactFirstNameEdit, contactLastNameEdit, contactEmailEdit, contactPhoneEdit (the new contact details)
    let contactId = document.getElementById("contactIdEdit").value;
    let contactFirstName = document.getElementById("contactFirstNameEdit").value;
    let contactLastName = document.getElementById("contactLastNameEdit").value;
    let contactEmail = document.getElementById("contactEmailEdit").value;
    let contactPhone = document.getElementById("contactPhoneEdit").value;

    // Clear any previous message
    document.getElementById("contactEditResult").innerHTML = "";

    // Basic validation (you can add more robust checks as needed)
    if (!contactId || !contactFirstName || !contactLastName || !contactEmail || !contactPhone) {
        document.getElementById("contactEditResult").innerHTML = "Please fill out all fields for editing the contact.";
        return;
    }

    // Build the JSON payload including the contact's unique id and the userId.
    let tmp = {
        contactId: contactId,
        firstName: contactFirstName,
        lastName: contactLastName,
        email: contactEmail,
        phone: contactPhone,
        userId: userId
    };
    let jsonPayload = JSON.stringify(tmp);

    // Set the API endpoint to the EditContact service.
    let url = urlBase + '/EditContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    document.getElementById("contactEditResult").innerHTML = "Contact has been updated.";
                } else {
                    document.getElementById("contactEditResult").innerHTML = "Error updating contact.";
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactEditResult").innerHTML = err.message;
    }
}

function openEditContactModal(contactId, firstName, lastName, email, phone) {
    // Populate modal fields with the contact's current details
    document.getElementById("editContactId").value = contactId;
    document.getElementById("editContactFirstName").value = firstName;
    document.getElementById("editContactLastName").value = lastName;
    document.getElementById("editContactEmail").value = email;
    document.getElementById("editContactPhone").value = phone;

    // Show the modal
    let editModal = new bootstrap.Modal(document.getElementById("editContactModal"));
    editModal.show();
}

function saveContactEdits() {
    let contactId = document.getElementById("editContactId").value;
    let firstName = document.getElementById("editContactFirstName").value;
    let lastName = document.getElementById("editContactLastName").value;
    let email = document.getElementById("editContactEmail").value;
    let phone = document.getElementById("editContactPhone").value;
	

    let tmp = {
        contactId: contactId,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        userId: userId
    };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/EditContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    // Update the table row if the edit is successful
                    loadContacts();
                    
                } else {
                    alert("Error updating contact.");
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.error("Error:", err.message);
    }

    let editModal = bootstrap.Modal.getInstance(document.getElementById("editContactModal"));
    editModal.hide();
}

// Function to delete a contact
function deleteContact(ID) {
	
	console.log("id" , ID);
	
	let confirmation = confirm("Are you sure you want to delete this contact?");
	if(confirmation){
	
	let row = event.target.closest("tr");

	
	 if (row) {
        row.remove(); // Remove the row from the table
        console.log(`Row with ID contact-${ID} removed from table.`);
    } else {
        console.error(`Error: Could not find row with ID contact-${ID}.`);
    }
	
	
	
    let tmp = { contactId: ID, userId: userId }; // Include any necessary user information
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/DeleteContact.' + extension; // Adjust based on your API

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true); // POST request to the API
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            // If successful, show a success message
            console.log("Contact deleted successfully from the server.");
            // You can also refresh the contacts list or just keep the front-end change (row removal).
        } else if (this.readyState === 4) {
            // If there's an error, log it
            console.error("Failed to delete contact:", this.status, this.responseText);
        }
    };

    try {
        xhr.send(jsonPayload); // Send the request with the contact ID
    } catch (err) {
        console.log(err.message);
    }
	} else {
        console.log("Deletion cancelled by the user.");
		return;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    readCookie(); // Read cookies after the DOM has loaded
});