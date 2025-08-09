const utilities = require("../utilities")
const accountModel = require("../models/account-model") //bringing the account model into scope
const bcrypt = require("bcryptjs") //21.6k (gzipped: 9.8k)



/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { 
            account_firstname, 
            account_lastname, 
            account_email, 
            account_password
        } = req.body
        // Hash the password before storing
        let hashedPassword
        try {
            // regular password and cost (salt is generated automatically)
            hashedPassword = await bcrypt.hashSync(account_password, 10)
        } catch (error) {
            req.flash("notice", 'Sorry, there was an error processing the registration.')
            res.status(500).render("account/register", {
                title: "Registration",
                nav,
                errors: null,
            })
        }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )
    
    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }
}

/* ****************************************
*  Process Login
* *************************************** */
async function loginAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body

    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Invalid email or password.")
        return res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email
        })
    }

    // Compare entered password with stored hash
    const passwordMatch = await bcrypt.compare(account_password, accountData.account_password)
    if (!passwordMatch) {
        req.flash("notice", "Invalid email or password.")
        return res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email
        })
    }

    // Successful login
    req.flash("notice", `Welcome back, ${accountData.account_firstname}!`)
    res.redirect("/")
}



module.exports = { buildLogin, buildRegister, registerAccount, loginAccount }
