

var usersList = document.querySelector("list-users");
var usersApi = "https://60becf8e6035840017c17a48.mockapi.io/users";
var saveBtn = document.querySelector("#edit.btn");
saveBtn.style.display = "none";
var notificationContainer = document.getElementById("notification-container");

function start() {
    getUsers(render);
    handleCreateForm();
}

start();

//functions

function getUsers(callback) {
    fetch(usersApi)
        .then(function (respone) {
            return respone.json();
        })
        .then(callback);
}

function render(users) {
    var tableBody = document
        .getElementById("myTable")
        .getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";
    for (var i = 0; i < users.length; i++) {
        var row = tableBody.insertRow(i);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        cell1.textContent = users[i].id;
        cell2.textContent = users[i].name;
        var img = document.createElement("img");
        img.src = users[i].avatar;
        img.alt = "User Avatar";
        cell3.appendChild(img);
        cell4.textContent = users[i].email;
        cell5.textContent = users[i].city;

        var editButton = document.createElement("button");
        editButton.className = "edit-btn";
        editButton.innerHTML = '<i class="fa-solid fa-pen"></i>';
        editButton.onclick = createEditHandler(users[i].id);

        var deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        deleteButton.onclick = createDeleteHandler(users[i].id);

        cell6.appendChild(editButton);
        cell6.appendChild(deleteButton);

        cell1.style.textAlign = "center";
        cell2.style.textAlign = "center";
        cell3.style.textAlign = "center";
        cell4.style.textAlign = "center";
        cell5.style.textAlign = "center";
        cell6.style.textAlign = "center";
    }
}

function createEditHandler(id) {
    return function () {
        editUser(id);
    };
}

function createDeleteHandler(id) {
    return function () {
        deleteUser(id);
    };
}

function handleCreateForm() {
    var createBtn = document.querySelector("#create");
    createBtn.onclick = function () {
        var name = document.querySelector('input[name="name"]').value;
        var ava = document.querySelector('input[name="ava"]').value;
        var email = document.querySelector('input[name="email"]').value;
        var city = document.querySelector('input[name="city"').value;

        var formData = {
            name: name,
            ava: ava,
            email: email,
            city: city,
        };
        createUsers(formData, function () {
            getUsers(render);
            document.querySelector('input[name="name"]').value = "";
            document.querySelector('input[name="ava"]').value = "";
            document.querySelector('input[name="email"]').value = "";
            document.querySelector('input[name="city"').value = "";
            document.querySelector('input[name="name"]').focus();
        });
    };
}

function createUsers(data, callback) {
    var options = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    };
    fetch(usersApi, options)
        .then(function (response) {
            response.json();
        })
        .then(function () {
            callback();
            showSuccessMessage("User created!");
        })
        .catch(function (error) {
            showSuccessMessage("User create failed!");
        });
}

function editUser(id) {
    fetch(usersApi)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            data.forEach(function (user) {
                if (user.id == id) {
                    document.querySelector('input[name="name"]').value =
                        user.name;
                    document.querySelector('input[name="ava"]').value =
                        user.avatar;
                    document.querySelector('input[name="email"]').value =
                        user.email;
                    document.querySelector('input[name="city"').value =
                        user.city;
                    document.querySelector("#create.btn").style.display =
                        "none";
                    saveBtn.style.display = "block";
                    saveBtn.onclick = function () {
                        user.name =
                            document.querySelector('input[name="name"]').value;
                        user.avatar =
                            document.querySelector('input[name="ava"]').value;
                        user.email = document.querySelector(
                            'input[name="email"]'
                        ).value;
                        user.city =
                            document.querySelector('input[name="city"').value;
                        var obj = {
                            name: user.name,
                            email: user.email,
                            avatar: user.avatar,
                            city: user.city,
                        };
                        document.querySelector('input[name="name"]').value = "";
                        document.querySelector('input[name="ava"]').value = "";
                        document.querySelector('input[name="email"]').value =
                            "";
                        document.querySelector('input[name="city"').value = "";
                        var options = {
                            method: "PUT",
                            body: JSON.stringify(obj),
                            headers: {
                                "Content-Type": "application/json",
                            },
                        };
                        fetch(usersApi + "/" + id, options).then(function (
                            response
                        ) {
                            if (!response.ok) {
                                throw new Error("Network response was not ok");
                            }
                            showSuccessMessage("Edited successfully");
                            setTimeout(function () {
                                location.reload(true);
                            }, 1500);
                            return response.json();
                        });
                    };
                }
            });
        });
}

function deleteUser(id) {
    var tableBody = document
        .getElementById("myTable")
        .getElementsByTagName("tbody")[0];
    var index;
    for (var i = 0; i < tableBody.rows.length; i++) {
        if (tableBody.rows[i].cells[0].textContent == id) {
            index = i;
            break;
        }
    }

    if (index !== undefined) {
        tableBody.deleteRow(index);
    }

    var options = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    };
    fetch(usersApi + "/" + id, options)
        .then(function (response) {
            return response.json();
        })
        .then(function () {
            showSuccessMessage("User deleted");
            document.querySelector(".success-message").style.background = "red";
        })
        .catch(function (error) {
            console.error("Error deleting user:", error);
        });
}

function showSuccessMessage(message) {
    var successMessage = document.createElement("div");
    successMessage.className = "success-message";
    successMessage.textContent = message;
    notificationContainer.appendChild(successMessage);
    setTimeout(function () {
        successMessage.remove();
    }, 3000);
}
