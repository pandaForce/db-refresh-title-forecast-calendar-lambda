/*** version history
			
Date				version		Developer			Change Identifier			Change
________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
03-May-2023			V1.0.0		Sumeet P.			230221				Initial Dev. Extract stage and product records ( House and Land , HL10/90 , Townhouse )
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

      // salesforce.stage_data
      const stage_data = await salesforce.getRecords ( custom_config.APP_SOQL.STAGE_DATA )      
      if ( ! utilities.canContinueExecution ( 'getRecords-stage_data' , stage_data  ) ) { res.send ( stage_data ) ; return }

      console.log ( ' stage_data.statuscode : ' + stage_data.statuscode )
      console.log ( ' stage_data.data.length : ' + stage_data.data.length )

      // add tag - effective forecast title date
      const effective_stage_data = stage_data.data.reduce((ret_val, o) => 
      { 
           o [ "Effective_title_date" ] = o.LandRegistrationDateForecast__c != null ? o.LandRegistrationDateForecast__c : o.TitleDateBudgeted__c
            ret_val.push( { ...o})
            return ret_val
      }, [])

      // console.log ( ' effective stage_data : ' + effective_stage_data.length )

      const hl1090_data = await salesforce.getRecords ( custom_config.APP_SOQL.HL1090_DATA )      
      if ( ! utilities.canContinueExecution ( 'getRecords-hl1090_data' , hl1090_data  ) ) { res.send ( hl1090_data ) ; return }

      console.log ( ' hl1090_data.statuscode : ' + hl1090_data.statuscode )
      console.log ( ' hl1090_data.data.length : ' + hl1090_data.data.length )


      const townhouse_data = await salesforce.getRecords ( custom_config.APP_SOQL.TOWNHOUSE_DATA )      
      if ( ! utilities.canContinueExecution ( 'getRecords-townhouse_data' , hl1090_data  ) ) { res.send ( townhouse_data ) ; return }

      console.log ( ' townhouse_data.statuscode : ' + townhouse_data.statuscode )
      console.log ( ' townhouse_data.data.length : ' + townhouse_data.data.length )
      
      // authenticate : firebase
      const firebase_authentication = await firebase_util.getAuthToken ( process.env.FIREBASE_API_KEY , process.env.FIREBASE_USER_NAME , process.env.FIREBASE_USER_PASSWORD )
      if ( ! utilities.canContinueExecution ( 'firebase_util.getAuthToken' , firebase_authentication  ) ) { await closingFunction ( custom_config.log_file_string ,  res , 'firebase_util.getAuthToken' , JSON.stringify ( { api_key : process.env.FIREBASE_API_KEY , user_name : process.env.FIREBASE_USER_NAME , pwd : process.env.FIREBASE_USER_PASSWORD } ) , JSON.stringify ( firebase_authentication )  , 'Error' )  ; return }
      
      console.log ( ' firebase_authentication.data.idToken : ' + firebase_authentication.data.idToken )

      const payload_to_update = { statuscode : stage_data.statuscode , data : effective_stage_data , hl1090data : hl1090_data.data , townhousedata : townhouse_data.data  } 

      // update firebase
      response = await firebase_util.getData ( 'put' , payload_to_update , custom_config.FIREBASE.RTDB_BASE + custom_config.FIREBASE.RTDB_VAR + '?auth=' +  firebase_authentication.data.idToken  )
      if ( ! utilities.canContinueExecution ( 'firebase_api_call-put' , response  ) ) { res.send ( response ) ; return }
     
      // DBRefresh__c - 
      response = await salesforce.createDbFetchTransactionRecord ( 'DBRefresh__c' , { App__c : custom_config.APP_NAME , StatusCode__c : response.statuscode , TotalRecordsFetched__c : effective_stage_data.length , Data__c : custom_config.DATA_TYPE } )
      if ( ! utilities.canContinueExecution ( 'insertSoql' , response  ) ) { res.send ( response ) ; return }

      
      //  *** FORCE END
      // callback ( null, { statusCode: 200, body: JSON.stringify ( { titled_lots } ) } )
      // callback ( null, { statusCode: 200, body: JSON.stringify ( { firebase_authentication } ) } )
      // callback ( null, { statusCode: 200, body: JSON.stringify ( { payload_to_update } ) } )
      callback ( null, { statusCode: 200, body: JSON.stringify ( { response } ) } )
      return


}


