// utilities/inv-validation.js
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.addClassificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .notEmpty().withMessage("Classification name is required")
            .isAlphanumeric().withMessage("No spaces or special characters allowed"),
    ]
}

validate.checkAddClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.status(400).render("inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors,
            classification_name,
        })
        return
    }
next()
}

module.exports = validate
