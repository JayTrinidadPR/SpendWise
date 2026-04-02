const loadUsersBtn = document.getElementById("loadUsersBtn");// const userInfoDiv = document.getElementById("userInfo");
const usersList = document.getElementById("usersList"); // const userInfoDiv = document.getElementById("userInfo");

async function loadUsers () {
    try { 
        const response = await fetch("http://localhost:3000/users"); // Fetch the list of users from the server
        const users = await response.json(); // Parse the response as JSON
console.log("Users loaded:", users); // Log the retrieved users to the console for debugging
        usersList.innerHTML = ""; // Clear the user list before adding new items

        users.forEach((user) => { // Iterate over each user in the retrieved list
            const li = document.createElement("li"); // Create a new list item element
            li.textContent = `${user.username} (${user.email})`; // Set the text content of the list item to display the user's username and email
            usersList.appendChild(li); // Append the list item to the user list in the DOM
        });
    } catch (error) { // Handle any errors that occur during the fetch operation
        console.error("Error loading users:", error); // Log the error to the console for debugging
        usersList.innerHTML = "<li>Error loading users</li>"; // Display an error message in the user list if the fetch operation fails
    }
}

loadUsersBtn.addEventListener("click", loadUsers); // Add a click event listener to the "Load Users" button that triggers the loadUsers function when clicked