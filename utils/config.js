require("dotenv").config();

const IS_PRODUCTION = true
const APP_NAME = 'Xero - Archtek'
const ENVIRONMENT = IS_PRODUCTION ? 'Production' : 'Sandbox' 
const TRACKING_CATEGORY_ID = 
    {
        'Xero - Archtek' :
            {
                'Production' : '701dd38b-a88f-44a9-b2d9-ac80dd499273',
                'Sandbox' : '1d026937-d019-4cfd-bc84-7f5eae357039'
            }
    }
const APP_SOQL = 
{
    TRACKING_CATEGORY_OPTIONS_SOQL : "select Id, ProjectNumber__c , ProjectStartYear__c , TrackingCategoryID__c, TrackingOptionID__c , TrackingOptionName__c , Environment__c, Statuscode__c from ProWorkflowTrackingCategories__c where TrackingCategoryID__c = '" + TRACKING_CATEGORY_ID[APP_NAME][ENVIRONMENT] + "' AND Environment__c = '" + ENVIRONMENT + "' AND Statuscode__c = '200' AND ProjectNumber__c != null",
}

const FIREBASE = {
    RTDB_BASE : 'https://tracking-category-options-default-rtdb.asia-southeast1.firebasedatabase.app' ,
    RTDB_VAR : '/data.json',
}
 
const SALESFORCE_OAUTH_CONFIG = {
    loginUrl : 'https://login.salesforce.com',
    clientId : process.env.CLIENT_ID,
    clientSecret : process.env.CLIENT_SECRET,
    redirectUri : process.env.REDIRECT_URI
  }

module.exports.ENVIRONMENT = ENVIRONMENT
module.exports.APP_NAME = APP_NAME
module.exports.APP_SOQL = APP_SOQL
module.exports.TRACKING_CATEGORY_ID = TRACKING_CATEGORY_ID
module.exports.FIREBASE = FIREBASE
module.exports.SALESFORCE_OAUTH_CONFIG = SALESFORCE_OAUTH_CONFIG
