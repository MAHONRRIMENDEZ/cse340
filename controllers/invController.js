const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")


const invCont = {}

/* ***************************
 * Build the inventory management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        res.render("./inventory/management", {
            title: "Inventory Management",
            nav
        })
    } catch (error) {
        next(error)
    }
}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}
/* ***************************
 * Build vehicle detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
    const invId = req.params.invId
    const data = await invModel.getInventoryById(invId)
    const nav = await utilities.getNav()
    const vehicleName = `${data.inv_make} ${data.inv_model}`

res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    vehicle: data
})
}



invCont.triggerError = function (req, res, next) {
    next(new Error("Error del servidor simulado (500 desde controlador)"))
}

const { validationResult } = require("express-validator")

// Mostrar el formulario para agregar clasificación
invCont.buildAddClassification = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            title: "Add New Classification",
            nav,
            classification_name: ""
        })
    } catch (error) {
        next(error)
    }
}

// Procesar inserción de nueva clasificación
invCont.addClassification = async function (req, res, next) {
    const { classification_name } = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        return res.status(400).render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: errors.array(),
        classification_name
        })
    }

    try {
    const result = await invModel.addClassification(classification_name)

    if (result) {
      let nav = await utilities.getNav() // incluye la nueva clasificación
        req.flash("success_msg", `Classification "${classification_name}" added successfully!`)
        return res.status(201).render("inventory/management", {
            title: "Inventory Management",
            nav,
            success_msg: req.flash("success_msg")
        })
        } else {
            throw new Error("Failed to add classification")
        }
        } catch (error) {
        let nav = await utilities.getNav()
        req.flash("error_msg", "Sorry, the classification could not be added.")
        return res.status(500).render("inventory/add-classification", {
            title: "Add New Classification",
            nav,
            error_msg: req.flash("error_msg"),
            classification_name
        })
    }
}


module.exports = invCont