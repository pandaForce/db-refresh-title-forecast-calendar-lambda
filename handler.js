/*** version history
			
Date				version		Developer			Change Identifier			Change
________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
03-Aug-2023			V1.0.0		Sumeet P.			230221				Initial Dev. Extract Enquiry and MyEvent records from Salesforce into firebase
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

      // salesforce.get tracking category options - proworkflow
      response = await salesforce.getTrackingCategoryOptions ( custom_config.APP_SOQL.TRACKING_CATEGORY_OPTIONS_SOQL )      
      if ( ! utilities.canContinueExecution ( 'getTrackingCategoryOptions' , response  ) ) { res.send ( response ) ; return }

      // authenticate : firebase
      const firebase_authentication = await firebase_util.getAuthToken ( process.env.FIREBASE_API_KEY , process.env.FIREBASE_USER_NAME , process.env.FIREBASE_USER_PASSWORD )
      if ( ! utilities.canContinueExecution ( 'firebase_util.getAuthToken' , firebase_authentication  ) ) { await closingFunction ( custom_config.log_file_string ,  res , 'firebase_util.getAuthToken' , JSON.stringify ( { api_key : process.env.FIREBASE_API_KEY , user_name : process.env.FIREBASE_USER_NAME , pwd : process.env.FIREBASE_USER_PASSWORD } ) , JSON.stringify ( firebase_authentication )  , 'Error' )  ; return }
      console.log ( ' firebase_authentication.data.idToken : ' + firebase_authentication.data.idToken )
      console.log ( ' response.data.length : ' + response.data.length )

      // update firebase
      // response = await utilities.firebase_api_call ( 'put' , '' , custom_config.FIREBASE.RTDB_BASE+ custom_config.FIREBASE.RTDB_VAR , response.data)
      response = await firebase_util.getData ( 'put' , response.data , custom_config.FIREBASE.RTDB_BASE + custom_config.FIREBASE.RTDB_VAR + '?auth=' +  firebase_authentication.data.idToken  )
      if ( ! utilities.canContinueExecution ( 'firebase_api_call' , response  ) ) { res.send ( response ) ; return }

      // saleforce.fetch transaction summary record
      response = await salesforce.createDbFetchTransactionRecord ( 'DBRefresh__c' , { App__c : custom_config.APP_NAME , StatusCode__c : response.statuscode , TotalRecordsFetched__c : response.data.length , Data__c : 'Tracking Options'} )
      if ( ! utilities.canContinueExecution ( 'insertSoql' , response  ) ) { res.send ( response ) ; return }
      
      //  *** END
	callback(null, { statusCode: 200, body: JSON.stringify({'results': response})})

}


