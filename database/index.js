const { Pool } = require("pg") // imports the "Pool" functionality from the "pg" package. A pool is a collection of connection objects (10 is the default number) that allow multiple site visitors to be interacting with the database at any given time.
require("dotenv").config() // imports the "dotenv" package which allows the sensitive information about the database location and connection credentials to be stored in a separate location and still be accessed.
/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */
let pool
if (process.env.NODE_ENV == "development") {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { // describes how the Secure Socket Layer (ssl) is used in the connection to the database, but only in a remote connection, as exists in our development environment.
            rejectUnauthorized: false, 
        },
})

// Added for troubleshooting queries
// during development
module.exports = {
    async query(text, params) {
        try {
        const res = await pool.query(text, params)
        console.log("executed query", { text })
        return res
        } catch (error) {
        console.error("error in query", { text })
        throw error
    }
},
}
} else {
    pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    })
    module.exports = pool
}