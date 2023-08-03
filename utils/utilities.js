const axios = require('axios')
const jsforce = require('jsforce')
require("dotenv").config();

const custom_config = require("./config");

// validate response of an async function
const canContinueExecution = ( step_name , response_to_validate ) => {
      console.log ( 'continueExecution after ' + step_name + ' ? ' )
      let outcome = true
      if ( response_to_validate == null ) return false
      if ( response_to_validate.statuscode != 200 ) return false
      console.log ( outcome )
      return outcome
}

// salesforce
async function runSoql ( soql ) {
      return new Promise ((resolve, reject) => {
            const conn = new jsforce.Connection({oauth2: custom_config.SALESFORCE_OAUTH_CONFIG})
            conn.login ( process.env.SFID, process.env.SFPWD, function (err, userInfo) {
                  if ( err ) resolve ( { "statuscode": 400, "data" : err.stack.toString() } )
                  var records = [];
                  var query = conn.query( soql)
                  .on("record", function(record) {
                        records.push(record);
                  })
                  .on("end", function() {
                        console.log ( " total records fetched : " + query.totalFetched);
                        resolve ( { statuscode: 200, data : records })                        
                  })
                  .on("error", function(err) {
                        resolve ( { "statuscode": 400, "data" : err.stack.toString() } )
                  })
                  .run({ autoFetch : true, maxFetch : 10000 }); //
            })
    })
} 

// salesforce
async function insertSoql ( obj_name , record_data) {
      console.log ( ' inside insertSoql | record_data : ' + JSON.stringify ( record_data ) )
      return new Promise ((resolve, reject) => {
            const conn = new jsforce.Connection({oauth2: custom_config.SALESFORCE_OAUTH_CONFIG})
            conn.login(process.env.SFID, process.env.SFPWD, function (err, userInfo) {
                  if ( err ) resolve ( { "statuscode": 400, "data" : err.stack.toString() } )
                  conn.sobject(obj_name ).create( record_data, function(err, ret) {
                        if (err) { return console.error(err); }
                        console.log("Created ' + obj_name + ' record with id : " + ret.id);
                        resolve ( { statuscode : 200 , data : {records_inserted : ret , err : err} } )
                  });
            })
      })
}


// firebase
async function firebase_api_call ( call_type , rtdb , var_type , data ) {
	console.log ( ' \n inside firebase_api_call ')
	return new Promise ((resolve, reject) => {
            axios.request ( firebaseConfigPrep ( call_type , rtdb , var_type , data )  )
            .then((response) => { resolve ( { statuscode : response.status ,  data : response.data} )})
            .catch((err) => {
                  console.log ( err )
                  resolve ( { statuscode : 400 ,  data : err.stack.toString() } )
            });
	})
}

// firebase
const firebaseConfigPrep = ( call_type , rtdb , var_type , data ) => {
      return {
            method: call_type ,
            url: rtdb + var_type ,
            headers: { } ,
            data : data
      }
}

module.exports.runSoql = runSoql
module.exports.insertSoql = insertSoql
module.exports.canContinueExecution =  canContinueExecution
module.exports.firebase_api_call =  firebase_api_call