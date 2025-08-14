const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const { body, validationResult } = require("express-validator");


const invCont = {}

/* ***************************
 * Build the inventory management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        //añadido en sem 5 
        const classificationList = await utilities.buildClassificationList();
        res.render("./inventory/management", {
            title: "Inventory Management",
            nav,
            classificationList,
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



/* ***************************
 * Mostrar formulario para añadir vehículo
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
try {
    const classificationList = await utilities.buildClassificationList();
    let nav = await utilities.getNav();
    res.render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList,
        });
    } catch (error) {
        next(error);
    }
}; 

/* ***************************
 * Insertar nuevo vehículo en BD
 * ************************** */
// Procesar inserción de nuevo vehículo
invCont.addInventory = async function (req, res, next) {
    const {
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id } = req.body

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.status(400).render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        errors: errors.array(),
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    })
}

try {
    const newVehicleId = await invModel.addInventoryItem({
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    })

    if (newVehicleId) {
        let nav = await utilities.getNav()
        req.flash("success_msg", `Vehicle "${inv_make} ${inv_model}" added successfully!`)
        return res.status(201).render("inventory/management", {
        title: "Inventory Management",
        nav,
        success_msg: req.flash("success_msg")
    })
    } else {
        throw new Error("Failed to add inventory item")
    }
    } catch (error) {
        console.error("Error adding vehicle:", error)
        let nav = await utilities.getNav()
        req.flash("error_msg", "Sorry, the vehicle could not be added.")
        return res.status(500).render("inventory/add-inventory", {
            title: "Add New Vehicle",
            nav,
            error_msg: req.flash("error_msg"),
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        })
    }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
            return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}

module.exports = invCont