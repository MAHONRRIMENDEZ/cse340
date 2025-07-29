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
app.get("/", baseController.buildHome) // esta es la version actualizada
/*
app.get("/", function(req, res){ // esta es la version antes de la alteracion en la tarea de w3 "MVC Getting started"
  res.render("index", {title: "Home"})
})*/

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
