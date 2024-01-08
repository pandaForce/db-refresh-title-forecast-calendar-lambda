require("dotenv").config();

const IS_PRODUCTION = true
const APP_NAME = 'Titled Lots'
const DATA_TYPE = 'Land Products'
const ENVIRONMENT = IS_PRODUCTION ? 'Production' : 'Sandbox' 

const APP_SOQL = 
{
    TITLED_LOTS : "select Id,  Name, pROJECT__r.Name , Stage__r.name, StatusDevr__c, LatestMasterContract__r.Name , LatestMasterContract__r.mastercontracttype__c , AllocationGroup__c , ProductAllocatedTo__c , LatestMasterContract__r.LandContractStatus__c , LatestMasterContract__r.BuildContractStatus__c , LatestMasterContract__r.PropertyContractStatus__c, LandRegistrationTitleDate_Forecast__c , LandRegistrationDateActual__c , LatestMasterContract__r.contractlifecycle__c, LatestMasterContract__r.contractlifecycle__r.SiteStartActual__c, LatestMasterContract__r.contractlifecycle__r.SlabStage__c,LatestMasterContract__r.contractlifecycle__r.FrameStage__c,LatestMasterContract__r.contractlifecycle__r.LockUpStage__c,LatestMasterContract__r.contractlifecycle__r.FixStage__c,LatestMasterContract__r.contractlifecycle__r.FinalStage__c ,  LatestMasterContract__r.contractlifecycle__r.SettlementStage__c , LatestMasterContract__r.ListedProduct__r.producttype__c from Product2 where ProductType__c = 'Land' AND Project__r.activeforreporting__c = true AND ( LatestMasterContract__r.ListedProduct__r.producttype__c = 'H+L 10/90' OR  productallocatedto__c = 'Resimax Reserved - Titled Lot' )",
}

const FIREBASE = {
    RTDB_BASE : 'https://titled-lots-report-a0b52-default-rtdb.asia-southeast1.firebasedatabase.app' ,
    RTDB_VAR : '/titledlots.json',
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
module.exports.FIREBASE = FIREBASE
module.exports.SALESFORCE_OAUTH_CONFIG = SALESFORCE_OAUTH_CONFIG
module.exports.DATA_TYPE = DATA_TYPE

