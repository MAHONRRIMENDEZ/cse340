// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidation = require("../utilities/inv-validation")
//const { body } = require("express-validator") // posiblemente no sea necesario


//// Management view route (GET /inv/)
router.get("/", utilities.handleErrors(invController.buildManagement))

// Route to build inventory by classification view
///router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));


// Route to build vehicle detail view
///router.get("/detail/:invId", invController.buildByInvId)
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));


// Ruta para probar error 500
router.get("/detail/:invId3215", invController.triggerError)

// Mostrar formulario para agregar clasificación
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// Procesar formulario con validación
router.post(
    "/add-classification",
    invValidation.addClassificationRules(),
    utilities.handleErrors(invValidation.checkAddClassificationData),
    utilities.handleErrors(invController.addClassification)
)

// Mostrar formulario para añadir nuevo vehículo (GET)
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Procesar formulario para añadir nuevo vehículo (POST)
router.post(
    "/add-inventory",
    invValidation.addInventoryRules(),
    utilities.handleErrors(invValidation.checkInventoryData), // validación servidor (middleware)
    utilities.handleErrors(invController.addInventory)       // función para insertar y responder
);

module.exports = router;