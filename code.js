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
                window.location.href = "contact.html"; // Redirect on successful login
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
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
	userId = -1;
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

	if (userId < 0) {
		window.location.href = "contact.html";
	}
	else {
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
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
        document.getElementById("signupResult").innerHTML = "Please fill out all fields.";
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
    // Get the contact details from the input fields (ensure your HTML has these IDs)
    let contactFirstName = document.getElementById("contactFirstName").value;
    let contactLastName = document.getElementById("contactLastName").value;
    let contactEmail = document.getElementById("contactEmail").value;
    let contactPhone = document.getElementById("contactPhone").value;
    
    // Clear any previous messages
    document.getElementById("contactAddResult").innerHTML = "";

    // Validate that all fields are filled out (optional)
    if (!contactFirstName || !contactLastName || !contactEmail || !contactPhone) {
        document.getElementById("contactAddResult").innerHTML = "Please fill out all contact fields.";
        return;
    }

    // Build the payload including the logged in userId.
    let tmp = { 
        firstName: contactFirstName, 
        lastName: contactLastName, 
        email: contactEmail, 
        phone: contactPhone, 
        userId: userId 
    };
    let jsonPayload = JSON.stringify(tmp);

    // Update the API endpoint to the AddContact service.
    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    document.getElementById("contactAddResult").innerHTML = "Contact has been added.";
                } else {
                    document.getElementById("contactAddResult").innerHTML = "Error adding contact.";
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactAddResult").innerHTML = err.message;
    }
}


// Function to search for contacts
function searchContact() {
    // Get the search term from the input field. (Search is case sensitive.)
    let searchTerm = document.getElementById("searchText").value;
    document.getElementById("contactSearchResult").innerHTML = "";

    // Build the payload with the search term and the userId.
    let tmp = { search: searchTerm, userId: userId };
    let jsonPayload = JSON.stringify(tmp);

    // Update the API endpoint to the SearchContacts service.
    let url = urlBase + '/SearchContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    let jsonObject = JSON.parse(xhr.responseText);
                    let contactList = "";

                    if (jsonObject.results && jsonObject.results.length > 0) {
                        // Assume each result is an object with contact fields.
                        for (let i = 0; i < jsonObject.results.length; i++) {
                            let contact = jsonObject.results[i];
                            contactList += "Name: " + contact.firstName + " " + contact.lastName + "<br />";
                            contactList += "Email: " + contact.email + "<br />";
                            contactList += "Phone: " + contact.phone + "<br /><br />";
                        }
                    } else {
                        contactList = "No contacts found.";
                    }

                    // Display the results in the first <p> element.
                    document.getElementsByTagName("p")[0].innerHTML = contactList;
                } else {
                    document.getElementById("contactSearchResult").innerHTML = "Error retrieving contacts.";
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactSearchResult").innerHTML = err.message;
    }
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


// Function to delete a contact
function deleteContact() {
    // Retrieve the contact id to delete from an input field.
    // Ensure your HTML includes an input with the ID: contactIdDelete
    let contactId = document.getElementById("contactIdDelete").value;

    // Clear any previous message
    document.getElementById("contactDeleteResult").innerHTML = "";

    // Validate that a contact id was provided
    if (!contactId) {
        document.getElementById("contactDeleteResult").innerHTML = "Please provide the contact ID to delete.";
        return;
    }

    // Build the JSON payload including the contact id and the userId.
    let tmp = { contactId: contactId, userId: userId };
    let jsonPayload = JSON.stringify(tmp);

    // Set the API endpoint to the DeleteContact service.
    let url = urlBase + '/DeleteContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    document.getElementById("contactDeleteResult").innerHTML = "Contact has been deleted.";
                } else {
                    document.getElementById("contactDeleteResult").innerHTML = "Error deleting contact.";
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactDeleteResult").innerHTML = err.message;
    }
}