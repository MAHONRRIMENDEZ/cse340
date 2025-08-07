// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

// Add a "GET" route for the path that will be sent when the "My Account" link is clicked.
router.get("/login", utilities.handleErrors(accountController.buildLogin))

//Unit 4, deliver registration view activity
router.get("/register", utilities.handleErrors(accountController.buildRegister))


module.exports = router;