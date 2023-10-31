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

      // salesforce.get enquiries
      enquiries = await salesforce.getRecords ( custom_config.APP_SOQL.ENQUIRIES )      
      if ( ! utilities.canContinueExecution ( 'getRecords-enquiries' , enquiries  ) ) { res.send ( enquiries ) ; return }

      //  *** FORCE END
	callback ( null, { statusCode: 200, body: JSON.stringify ( { enquiries } ) } )
	// callback ( null, { statusCode: 200, body: JSON.stringify ( { data : { statuscode : 200 , enquiries : enquiries.data , myevents : my_events.data } } ) } )
	// callback ( null, { statusCode: 200, body: JSON.stringify ( { firebase_authentication } ) } )
	// callback ( null, { statusCode: 200, body: JSON.stringify ( { response } ) } )


      // salesforce.get my events
      my_events = await salesforce.getRecords ( custom_config.APP_SOQL.MY_EVENTS )      
      if ( ! utilities.canContinueExecution ( 'getRecords-my_events' , my_events  ) ) { res.send ( my_events ) ; return }

      // authenticate : firebase
      const firebase_authentication = await firebase_util.getAuthToken ( process.env.FIREBASE_API_KEY , process.env.FIREBASE_USER_NAME , process.env.FIREBASE_USER_PASSWORD )
      if ( ! utilities.canContinueExecution ( 'firebase_util.getAuthToken' , firebase_authentication  ) ) { await closingFunction ( custom_config.log_file_string ,  res , 'firebase_util.getAuthToken' , JSON.stringify ( { api_key : process.env.FIREBASE_API_KEY , user_name : process.env.FIREBASE_USER_NAME , pwd : process.env.FIREBASE_USER_PASSWORD } ) , JSON.stringify ( firebase_authentication )  , 'Error' )  ; return }
      
      console.log ( ' firebase_authentication.data.idToken : ' + firebase_authentication.data.idToken )

      const payload_to_update = { data : { statuscode : 200 , enquiries : enquiries.data , myevents : my_events.data } }

      // update firebase
      response = await firebase_util.getData ( 'put' , payload_to_update , custom_config.FIREBASE.RTDB_BASE + custom_config.FIREBASE.RTDB_VAR + '?auth=' +  firebase_authentication.data.idToken  )
      if ( ! utilities.canContinueExecution ( 'firebase_api_call-put' , response  ) ) { res.send ( response ) ; return }

      // DBRefresh__c - Enquiries
      response = await salesforce.createDbFetchTransactionRecord ( 'DBRefresh__c' , { App__c : custom_config.APP_NAME , StatusCode__c : response.statuscode , TotalRecordsFetched__c : enquiries.data.length , Data__c : 'Enquiries'} )
      if ( ! utilities.canContinueExecution ( 'insertSoql' , response  ) ) { res.send ( response ) ; return }

      // DBRefresh__c - My Events
      response = await salesforce.createDbFetchTransactionRecord ( 'DBRefresh__c' , { App__c : custom_config.APP_NAME , StatusCode__c : response.statuscode , TotalRecordsFetched__c : my_events.data.length , Data__c : 'My Events'} )
      if ( ! utilities.canContinueExecution ( 'insertSoql' , response  ) ) { res.send ( response ) ; return }
      

}


