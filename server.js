/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts") // el paquete "express-ejs-layouts" esta siendo guardado en la variable "expressLayouts" 
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute") /////// OJO CUIDADO CON ESTE QUE LO HICISTE TU SOLO
const utilities = require("./utilities"); 




/* ***********************
"View Engine and Templates"
 *************************/

app.set("view engine", "ejs") //la view engine es "ejs" 
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root- es decir que las plantillas estaran en una carpeta "layouts"

/* ***********************
 * Routes
 *************************/
app.use(static)

//Index route
app.get("/", utilities.handleErrors(baseController.buildHome))// esta es la version actualizada
/*
app.get("/", function(req, res){ // esta es la version antes de la alteracion en la tarea de w3 "MVC Getting started"
  res.render("index", {title: "Home"})
})*/

// Inventory routes
app.use("/inv", inventoryRoute)

// File Not Found Route
// Manejador de errores 500
app.use(async (err, req, res, next) => {
  console.error(err.stack)
  const nav = await utilities.getNav()
  res.status(500).render("errors/error", {
    title: "500",
    message: "Ocurrió un error interno del servidor. Estamos trabajando en ello.",
    nav,
    status: 500
  })
})
/* 404 Handler */
app.use(async (req, res, next) => {
  res.status(404).render("errors/error", {
    title: "404",
    message: "Página no encontrada. Puede que el enlace esté roto o que hayas escrito mal la dirección.",
    status: 404
  })
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})



