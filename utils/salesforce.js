require("dotenv").config();
const utilities = require("./utilities");

async function getRecords ( soql ) {
      console.log ( ' \n inside getRecords '  )
      const soql_response = await utilities.runSoql ( soql )
      return new Promise ((resolve, reject) => {
            resolve ( soql_response )
      })
}

async function createDbFetchTransactionRecord (  obj_name , record_data  ) {
      const insert_response = await utilities.insertSoql ( obj_name , record_data )
      return new Promise ((resolve, reject) => {
            resolve ( insert_response )       
      })
}

module.exports.getRecords =  getRecords
module.exports.createDbFetchTransactionRecord =  createDbFetchTransactionRecord

