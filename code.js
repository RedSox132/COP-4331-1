const urlBase = 'http://jacoblegler-cop4331.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin() {
    console.log("doLogin triggered");
    console.log("urlBase:", urlBase);
    console.log("Login API URL:", urlBase + '/Login.' + extension);

    userId = 0;
    firstName = "";
    lastName = "";

    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;

    if (!login || !password) {
        document.getElementById("loginResult").innerHTML = "Please enter both username and password.";
        return;
    }

    console.log("Login data:", { login, password });

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
                console.log("API Response:", jsonObject);

                userId = jsonObject.id;
                if (userId < 1) {
                    document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();
                window.location.href = "index.html"; // Redirect on successful login
            } else {
                document.getElementById("loginResult").innerHTML = "Error: Unable to connect to the API.";
                console.error("Error Response:", xhr.responseText);
            }
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
		window.location.href = "index.html";
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
                window.location.href = "index.html"; // Redirect on successful sign up
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

function addColor() //change this
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = { color: newColor, userId, userId };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/AddColor.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("colorAddResult").innerHTML = err.message;
	}

}

function searchColor() //change this
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";

	let colorList = "";

	let tmp = { search: srch, userId: userId };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SearchColors.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse(xhr.responseText);

				for (let i = 0; i < jsonObject.results.length; i++) {
					colorList += jsonObject.results[i];
					if (i < jsonObject.results.length - 1) {
						colorList += "<br />\r\n";
					}
				}

				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}

}
