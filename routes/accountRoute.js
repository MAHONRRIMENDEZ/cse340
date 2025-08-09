// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")

// Add a "GET" route for the path that will be sent when the "My Account" link is clicked.
router.get("/login", utilities.handleErrors(accountController.buildLogin))

//Unit 4, deliver registration view activity
router.get("/register", utilities.handleErrors(accountController.buildRegister))

//Process Registration 
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)
//deberia ser el mismo que: action="/account/register"

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.loginAccount)
)


module.exports = router;