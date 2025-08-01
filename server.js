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

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})


/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
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
