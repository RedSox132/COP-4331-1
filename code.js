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
        document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
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
                        let row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${contact.FirstName || 'N/A'} ${contact.LastName || 'N/A'}</td>
                            <td>${contact.Phone || 'N/A'}</td>
                            <td>${contact.Email || 'N/A'}</td>
                            <td>
                                <button class="btn btn-warning btn-sm" onclick="openEditContactModal('${contact.contactId}', '${contact.FirstName}', '${contact.LastName}', '${contact.Email}', '${contact.Phone}')">Edit</button>
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
                    let row = document.getElementById(`contact-${contactId}`);
                    row.innerHTML = `
                        <td>${firstName} ${lastName}</td>
                        <td>${phone}</td>
                        <td>${email}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="openEditContactModal('${contactId}', '${firstName}', '${lastName}', '${email}', '${phone}')">Edit</button>
                        </td>
                    `;
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
function deleteContact(contactId) {
    let tmp = { contactId: contactId, userId: userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/DeleteContact.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                contactIds = contactIds.filter(id => id !== contactId.toString()); // Remove the deleted contact ID
                saveCookie(); // Update the saved contact IDs

                loadContacts(); // Refresh the contact list after deletion
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    readCookie(); // Read cookies after the DOM has loaded
});