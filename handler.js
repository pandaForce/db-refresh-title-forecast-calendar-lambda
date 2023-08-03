/*** version history
			
Date		                			version               			Developer       				Change Identifier                		 Change
________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
03-Aug-2023					                V3.0.0					    Sumeet P.					             cr-230726		    		          Winston authorization error. Thumbnail quality issue after clickhomes server updagrade on 23-Jun-2023. IS-3268 : FW: Claim photos : setup Org for testing
________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
**/

const custom_config = require("./utils/config");
const salesforce = require("./utils/salesforce")
const utilities = require("./utils/utilities")

// lambda handler 
module.exports.db_fetch_handler = (event, context, callback) => {
	startProcessing ( callback )
}

// main
async function startProcessing ( callback  ) {
	let response 
      // salesforce.get tracking category options - proworkflow
      response = await salesforce.getTrackingCategoryOptions ( custom_config.APP_SOQL.TRACKING_CATEGORY_OPTIONS_SOQL )      
      if ( ! utilities.canContinueExecution ( 'getTrackingCategoryOptions' , response  ) ) { callback(null, { statusCode: 400, body: JSON.stringify({'results': response})}) ; return }

      // update firebase
      response = await utilities.firebase_api_call ( 'put' , '' , custom_config.FIREBASE.RTDB_BASE + custom_config.FIREBASE.RTDB_VAR , response.data)
      if ( ! utilities.canContinueExecution ( 'firebase_api_call' , response  ) ) { callback(null, { statusCode: 400, body: JSON.stringify({'results': response})}); return }

      // saleforce.fetch transaction summary record
      response = await salesforce.createDbFetchTransactionRecord ( 'DBRefresh__c' , { App__c : custom_config.APP_NAME , StatusCode__c : response.statuscode , TotalRecordsFetched__c : response.data.length , Data__c : 'Tracking Options'} )
      if ( ! utilities.canContinueExecution ( 'insertSoql' , response  ) ) { callback(null, { statusCode: 400, body: JSON.stringify({'results': response})}) ; return }
      
      //  *** END
	callback(null, { statusCode: 200, body: JSON.stringify({'results': response})})
}


