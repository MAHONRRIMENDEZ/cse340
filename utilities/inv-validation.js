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



validate.addInventoryRules = () => {
    return [
        body("classification_id")
            .trim()
            .notEmpty()
            .withMessage("Please select a classification."),

        body("inv_make")
            .trim()
            .notEmpty()
            .withMessage("Please provide the make of the vehicle.")
            .isLength({ min: 2 })
            .withMessage("Make must be at least 2 characters long."),

        body("inv_model")
            .trim()
            .notEmpty()
            .withMessage("Please provide the model of the vehicle.")
            .isLength({ min: 1 })
            .withMessage("Model must be at least 1 character long."),

        body("inv_year")
            .trim()
            .notEmpty()
            .withMessage("Please provide the year of the vehicle.")
            .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
            .withMessage(`Year must be a number between 1900 and ${new Date().getFullYear() + 1}.`),

        body("inv_description")
            .trim()
            .notEmpty()
            .withMessage("Please provide a description of the vehicle.")
            .isLength({ min: 10 })
            .withMessage("Description must be at least 10 characters long."),

        body("inv_image")
            .trim()
            .notEmpty()
            .withMessage("Please provide an image path for the vehicle."),

        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .withMessage("Please provide a thumbnail image path for the vehicle."),

        body("inv_price")
            .trim()
            .notEmpty()
            .withMessage("Please provide the price of the vehicle.")
            .isFloat({ min: 0 })
            .withMessage("Price must be a positive number."),

        body("inv_miles")
            .trim()
            .notEmpty()
            .withMessage("Please provide the mileage of the vehicle.")
            .isInt({ min: 0 })
            .withMessage("Miles must be a positive integer."),

        body("inv_color")
            .trim()
            .notEmpty()
            .withMessage("Please provide the color of the vehicle.")
            .isLength({ min: 3 })
            .withMessage("Color must be at least 3 characters long."),
    ]
}

validate.checkInventoryData = async (req, res, next) => {
    const {
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
} = req.body

const errors = validationResult(req)
if (!errors.isEmpty()) {
    let nav = await require(".").getNav() // usa tu utilities/index.js getNav
    // Obtener clasificaciones para volver a crear el select con sticky selected
    const invModel = require("../models/inventory-model")
    const classificationsData = await invModel.getClassifications()
    let classificationList = '<select name="classification_id" id="classificationList" required>'
    classificationList += '<option value="">Choose a Classification</option>'
    classificationsData.rows.forEach((row) => {
        classificationList += `<option value="${row.classification_id}"${
            row.classification_id == classification_id ? " selected" : ""
        }>${row.classification_name}</option>`
    })
    classificationList += "</select>"

    res.render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList,
        errors: errors.array(),
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
    })
    return
}
next()
}




module.exports = validate
