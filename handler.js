/*** version history
			
Date		                			version               			Developer       				Change Identifier                		 Change
________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
03-Aug-2023					                V3.0.0					    Sumeet P.					             cr-230726		    		          Winston authorization error. Thumbnail quality issue after clickhomes server updagrade on 23-Jun-2023. IS-3268 : FW: Claim photos : setup Org for testing
________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
**/


/****************************** config */

const axios = require('axios')
const jsforce = require('jsforce')
require("dotenv").config();

const IS_PRODUCTION = true
const APP_NAME = 'Xero - Archtek'
const ENVIRONMENT = IS_PRODUCTION ? 'Production' : 'Sandbox' 

const TRACKING_CATEGORY_ID =  {
	'Xero - Archtek' :
		{
                'Production' : '259a4f19-332c-4af7-81dc-fd3d4f72a452',
                'Sandbox' : '259a4f19-332c-4af7-81dc-fd3d4f72a452'
            }
}

const APP_SOQL =  {
	TRACKING_CATEGORY_OPTIONS_SOQL : "select Id, TrackingCategoryID__c, TrackingOptionID__c , TrackingOptionName__c from ProWorkflowTrackingCategories__c where TrackingCategoryID__c = '" + TRACKING_CATEGORY_ID[APP_NAME][ENVIRONMENT] + "'",
}

const FIREBASE = {
    RTDB_BASE : 'https://tracking-category-options-default-rtdb.asia-southeast1.firebasedatabase.app' ,
    RTDB_VAR : '/data.json'
}

const SALESFORCE_OAUTH_CONFIG = {
      loginUrl : 'https://login.salesforce.com',
      clientId : process.env.CLIENT_ID,
      clientSecret : process.env.CLIENT_SECRET,
      redirectUri : process.env.REDIRECT_URI
    }

/****************************** lambda handler */

module.exports.db_fetch_handler = (event, context, callback) => {
	startProcessing ( callback )
}

/****************************** main.js */

async function startProcessing ( callback  ) {
	let response 
      // salesforce.get tracking category options - proworkflow
      response = await getTrackingCategoryOptions ( APP_SOQL.TRACKING_CATEGORY_OPTIONS_SOQL )      
      if ( ! canContinueExecution ( 'getTrackingCategoryOptions' , response  ) ) { callback(null, { statusCode: 400, body: JSON.stringify({'results': response})}) ; return }

      // update firebase
      response = await firebase_api_call ( 'put' , '' , FIREBASE.RTDB_BASE+ FIREBASE.RTDB_VAR , response.data)
      if ( ! canContinueExecution ( 'firebase_api_call' , response  ) ) { callback(null, { statusCode: 400, body: JSON.stringify({'results': response})}); return }

      // saleforce.fetch transaction summary record
      response = await createDbFetchTransactionRecord ( 'DBRefresh__c' , { App__c : APP_NAME , StatusCode__c : response.statuscode , TotalRecordsFetched__c : response.data.length , Data__c : 'Tracking Options'} )
      if ( ! canContinueExecution ( 'insertSoql' , response  ) ) { callback(null, { statusCode: 400, body: JSON.stringify({'results': response})}) ; return }
      
      //  *** END
	callback(null, { statusCode: 200, body: JSON.stringify({'results': response})})
}

/****************************** salesforce.js */

async function getTrackingCategoryOptions ( soql ) {
      console.log ( ' \n inside getTrackingCategoryOptions '  )
      const soql_response = await runSoql ( soql )
      return new Promise ((resolve, reject) => {
            resolve ( soql_response )
      })
}

async function createDbFetchTransactionRecord (  obj_name , record_data  ) {
      const insert_response = await insertSoql ( obj_name , record_data )
      return new Promise ((resolve, reject) => {
            resolve ( insert_response )       
      })
}


/****************************** utilities.js */

//general - validate response of an async function
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
            const conn = new jsforce.Connection({oauth2: SALESFORCE_OAUTH_CONFIG})
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

//salesforce - insert
async function insertSoql ( obj_name , record_data) {
      console.log ( ' inside insertSoql | record_data : ' + JSON.stringify ( record_data ) )
      return new Promise ((resolve, reject) => {
            const conn = new jsforce.Connection({oauth2: SALESFORCE_OAUTH_CONFIG})
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

const firebaseConfigPrep = ( call_type , rtdb , var_type , data ) => {
      return {
            method: call_type ,
            url: rtdb + var_type ,
            headers: { } ,
            data : data
      }
}

