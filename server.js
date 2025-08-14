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
const utilities = require("./utilities/"); 
const session = require("express-session")
const pool = require('./database/')
const accountRoute = require("./routes/accountRoute")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")


/* ***********************
 * Middleware
 * ************************/
//que es esto?
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})
//bodyParser available for to the app
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

/* ***********************
"View Engine and Templates"
 *************************/
app.set("view engine", "ejs") //la view engine es "ejs" 
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root- es decir que las plantillas estaran en una carpeta "layouts"
//Unit 5, Login activity
app.use(cookieParser())
//Unit 5 Login Process activity    
app.use(utilities.checkJWTToken)

/* ***********************
 * Routes
 *************************/
app.use(require("./routes/static"))
//Index route
app.get("/", utilities.handleErrors(baseController.buildHome))// esta es la version actualizada
// Inventory route
app.use("/inv", require("./routes/inventoryRoute"))
//account route
app.use("/account", require("./routes/accountRoute"))



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



