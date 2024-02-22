/*** version history
			
Date				version		Developer			Change Identifier			Change
________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
11-Dec-2023			V1.0.0		Sumeet P.			230221				Initial Dev. Extract land records waiting to title
________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
**/

const custom_config = require("./utils/config");
const salesforce = require("./utils/salesforce")
const utilities = require("./utils/utilities")
const firebase_util = require("./utils/firebase_util")

// lambda handler 
module.exports.db_fetch_handler = (event, context, callback) => {
	startProcessing ( callback )
}

// main
async function startProcessing ( callback  ) {

      let response 

      // salesforce.get land records
      const titled_lots = await salesforce.getRecords ( custom_config.APP_SOQL.TITLED_LOTS )      
      if ( ! utilities.canContinueExecution ( 'getRecords-titled_lots' , titled_lots  ) ) { res.send ( titled_lots ) ; return }

      console.log ( ' titled_lots.statuscode : ' + titled_lots.statuscode )
      console.log ( ' titled_lots.data.length : ' + titled_lots.data.length )

            // salesforce.HL1090_LOTS
            const hl1090_lots = await salesforce.getRecords ( custom_config.APP_SOQL.HL1090_LOTS )      
            if ( ! utilities.canContinueExecution ( 'getRecords-hl1090_lots' , titled_lots  ) ) { res.send ( titled_lots ) ; return }

            console.log ( ' hl1090_lots.statuscode : ' + hl1090_lots.statuscode )
            console.log ( ' hl1090_lots.data.length : ' + hl1090_lots.data.length )      

      // authenticate : firebase
      const firebase_authentication = await firebase_util.getAuthToken ( process.env.FIREBASE_API_KEY , process.env.FIREBASE_USER_NAME , process.env.FIREBASE_USER_PASSWORD )
      if ( ! utilities.canContinueExecution ( 'firebase_util.getAuthToken' , firebase_authentication  ) ) { await closingFunction ( custom_config.log_file_string ,  res , 'firebase_util.getAuthToken' , JSON.stringify ( { api_key : process.env.FIREBASE_API_KEY , user_name : process.env.FIREBASE_USER_NAME , pwd : process.env.FIREBASE_USER_PASSWORD } ) , JSON.stringify ( firebase_authentication )  , 'Error' )  ; return }
      
      console.log ( ' firebase_authentication.data.idToken : ' + firebase_authentication.data.idToken )

      const payload_to_update = { statuscode : titled_lots.statuscode , data : titled_lots.data , hl1090_lots : hl1090_lots.data  } 

      // update firebase
      response = await firebase_util.getData ( 'put' , payload_to_update , custom_config.FIREBASE.RTDB_BASE + custom_config.FIREBASE.RTDB_VAR + '?auth=' +  firebase_authentication.data.idToken  )
      if ( ! utilities.canContinueExecution ( 'firebase_api_call-put' , response  ) ) { res.send ( response ) ; return }
     
      // DBRefresh__c - 
      response = await salesforce.createDbFetchTransactionRecord ( 'DBRefresh__c' , { App__c : custom_config.APP_NAME , StatusCode__c : response.statuscode , TotalRecordsFetched__c : titled_lots.data.length , Data__c : custom_config.DATA_TYPE } )
      if ( ! utilities.canContinueExecution ( 'insertSoql' , response  ) ) { res.send ( response ) ; return }

      
      //  *** FORCE END
      // callback ( null, { statusCode: 200, body: JSON.stringify ( { titled_lots } ) } )
      // callback ( null, { statusCode: 200, body: JSON.stringify ( { firebase_authentication } ) } )
      // callback ( null, { statusCode: 200, body: JSON.stringify ( { payload_to_update } ) } )
      callback ( null, { statusCode: 200, body: JSON.stringify ( { response } ) } )
      return


}


