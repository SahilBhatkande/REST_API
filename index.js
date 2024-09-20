const express = require("express");
const user = require('./MOCK_DATA.json');
const fs = require("fs")

const app = express();
const port = 8000;

// Middleware for parsing JSON bodies
app.use(express.urlencoded({extended : false}));
app.use(express.json());


// Start the server
app.listen(port, () => console.log(`App listening on port: ${port}`));

// Get all users
app.get("/user", (req, res) => {
    res.send(user);
});


app.get("/" , (req , res) => {

  res.send("Hello ji");

})

// Route for a single user by ID with multiple methods (GET, POST, PATCH, DELETE)
app.route("/user/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const foundUser = user.find((user) => user.id === id);

    if (foundUser) {
      return res.json(foundUser);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  })

  .post((req, res) => {
    const body = req.body;
    console.log("Request Body:", body);  // This should log the request body
    
    const newUser = { ...body, id: user.length + 1 };
    user.push(newUser);
  
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(user, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: "Error saving user", error: err });
      }
      return res.status(201).json(newUser);
    });
  })
  
  
  .patch((req, res) => {
    const id = Number(req.params.id);
    const userIndex = user.findIndex((u) => u.id === id);
  
    if (userIndex !== -1) {  // Check if user was found
      const updatedUser = { ...user[userIndex], ...req.body };  // Merge existing user with new data
      user[userIndex] = updatedUser;  // Update the user in the array
  
      fs.writeFile("./MOCK_DATA.json", JSON.stringify(user, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ message: "Error saving user", error: err });
        }
        return res.status(200).json(updatedUser);  // Return the updated user
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  })
  
  .delete((req, res) => {
    const id = Number(req.params.id);
    const userIndex = user.findIndex((u) => u.id === id);
  
    if (userIndex !== -1) {  // If user is found
      const deletedUser = user.splice(userIndex, 1);  // Remove the user from the array
  
      fs.writeFile("./MOCK_DATA.json", JSON.stringify(user, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ message: "Error deleting user", error: err });
        }
        return res.status(200).json({ message: "User deleted successfully", deletedUser });
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  });
  
