require("dotenv").config();

const IS_PRODUCTION = true
const APP_NAME = 'Tiitle Forecast'
const DATA_TYPE = 'Stage Records'
const ENVIRONMENT = IS_PRODUCTION ? 'Production' : 'Sandbox' 

const hl1090producttype = 'H+L 10/90'
const APP_SOQL = { 
  STAGE_DATA : "select Id, Name, BelongsToProject__c, BelongsToProject__r.Name , TitleDateBudgeted__c , LandRegistrationDateForecast__c  , LandRegistrationDateActual__c from Stage__c where  BelongsToProject__r.ActiveforReporting__c = true AND LandRegistrationDateActual__c = null AND StageType__c != 'Townhouses' AND  ( NOT Name like '%Townhouse%' ) AND ( NOT Name like '%Test%' ) "  ,
  HL1090_DATA : "select Id, Name, Project__r.Name , Stage__r.name, StatusDevr__c, LatestMasterContract__r.ContractSettlementDate__c , LatestMasterContract__r.TotalPackagePrice__c , LatestMasterContract__r.Name , LatestMasterContract__r.mastercontracttype__c , AllocationGroup__c , ProductAllocatedTo__c , LatestMasterContract__r.LandContractStatus__c , LatestMasterContract__r.BuildContractStatus__c , LatestMasterContract__r.PropertyContractStatus__c, LatestMasterContract__r.contractlifecycle__c, LatestMasterContract__r.contractlifecycle__r.SiteStartForecast__c , LatestMasterContract__r.contractlifecycle__r.SiteStartActual__c, LatestMasterContract__r.contractlifecycle__r.SlabStage__c,LatestMasterContract__r.contractlifecycle__r.FrameStage__c,LatestMasterContract__r.contractlifecycle__r.LockUpStage__c,LatestMasterContract__r.contractlifecycle__r.FixStage__c,LatestMasterContract__r.contractlifecycle__r.FinalStage__c ,  LatestMasterContract__r.contractlifecycle__r.SettlementStage__c , LatestMasterContract__r.ListedProduct__r.producttype__c , LandRegistrationDateActual__c , LandRegistrationTitleDate_Forecast__c , IsProjectHorizon__c , LandFrontage__c , LandDepth__c , LandSize__c , Price__c , LatestMasterContract__r.Purchaser__r.FullName__c , LatestMasterContract__r.ContractReservationDate__c , LatestMasterContract__r.LandContract__r.ContractedDate__c , LatestMasterContract__r.PropertyContract__r.ContractedDate__c , LatestMasterContract__r.TotalDepositsPaidToDate__c , LatestMasterContract__r.TotalDepositsAmount__c , LatestMasterContract__r.TotalDepositBalanceDue__c , LatestMasterContract__r.ListedProduct__r.Bed_Bath_Car__c , LatestMasterContract__r.ListedProduct__r.HouseDesign__r.Name , LatestMasterContract__r.LandPropertyContractedDate__c , LatestMasterContract__r.FIRBpendingifapplicable__c , LatestMasterContract__r.LandContract__r.ProductSettledDate__c , LatestMasterContract__r.BuildContract__r.ProductSettledDate__c , LatestMasterContract__r.PropertyContract__r.ProductSettledDate__c , Stage__r.Entity__c , Stage__r.LandRegistrationDateForecast__c , LatestMasterContract__r.LandContract__r.DateSoldDevNomura__c , LatestMasterContract__r.PropertyContract__r.DateSoldDevNomura__c , LatestMasterContract__r.LandContract__r.DepositDueDate__c , LatestMasterContract__r.PropertyContract__r.DepositDueDate__c , ForecastSiteStart__c from Product2 where ProductType__c = 'Land' AND LatestMasterContract__r.ListedProduct__r.ProductType__c =  '" + hl1090producttype + "'" ,
  TOWNHOUSE_DATA : "select Id, Name, BelongsToProject__c, BelongsToProject__r.Name , TitleDateBudgeted__c , LandRegistrationDateForecast__c  , LandRegistrationDateActual__c , BuildSettlementDateCurrentForec__c from Stage__c where  StageHasTownhouses__c = true"  ,
  // LOTS_DATA : "Select Id , Name , Stage__c , Stage__r.Name , StatusDEV__c from Product2 where  Stage__r.BelongsToProject__r.ActiveforReporting__c = true AND Stage__r.LandRegistrationDateActual__c = null AND Stage__r.StageType__c != 'Townhouses' AND  ( NOT Stage__r.Name like '%Test%' ) AND ProductType__c = 'Land' "
  LOTS_DATA : "Select Id , Name , Stage__c , Stage__r.Name , StatusDEV__c from Product2 where  Stage__r.BelongsToProject__r.ActiveforReporting__c = true AND Stage__r.LandRegistrationDateActual__c = null AND  ( NOT Stage__r.Name like '%Test%' ) AND ProductType__c = 'Land' "
}

const FIREBASE = {
    RTDB_BASE : 'https://title-forecast-calendar-default-rtdb.asia-southeast1.firebasedatabase.app/' ,
    RTDB_VAR : '/allstages.json',
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
