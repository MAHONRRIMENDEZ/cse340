const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
    const nav = await utilities.getNav()
    //req.flash("notice", "This is the flash message.") //esta linea hace un mensaje en el home view con cookies w04
    res.render("index", {title: "Home", nav})
}

module.exports = baseController