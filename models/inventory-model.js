const pool = require("../database/") // Because the file is index.js, it is the default file, and will be located inside the database folder without being specified. The path could also be ../database/index.js. It would return the same result.

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get vehicle data by inv_id
 * ************************** */
async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.inv_id = $1`,
        [inv_id]
    )
    return data.rows[0]  // Solo uno, no .rows (porque es vista individual)
  } catch (error) {
    console.error("getInventoryById error: " + error)
  }
}


module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById
}
// module.exports = {getClassifications} 

/*para ver como modificar esta funcion revisa la w02 lesson "understand data"*/ 