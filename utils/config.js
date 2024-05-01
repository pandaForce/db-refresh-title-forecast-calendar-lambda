require("dotenv").config();

const IS_PRODUCTION = true
const APP_NAME = 'Titled Lots'
const DATA_TYPE = 'Land Products'
const ENVIRONMENT = IS_PRODUCTION ? 'Production' : 'Sandbox' 

const APP_SOQL = { 
  // TITLED_LOTS : "select Id, Name, Project__r.Name , Stage__r.name, StatusDevr__c, LatestMasterContract__r.ContractSettlementDate__c , LatestMasterContract__r.TotalPackagePrice__c , LatestMasterContract__r.Name , LatestMasterContract__r.mastercontracttype__c , AllocationGroup__c , ProductAllocatedTo__c , LatestMasterContract__r.LandContractStatus__c , LatestMasterContract__r.BuildContractStatus__c , LatestMasterContract__r.PropertyContractStatus__c, LatestMasterContract__r.contractlifecycle__c, LatestMasterContract__r.contractlifecycle__r.SiteStartForecast__c , LatestMasterContract__r.contractlifecycle__r.SiteStartActual__c, LatestMasterContract__r.contractlifecycle__r.SlabStage__c,LatestMasterContract__r.contractlifecycle__r.FrameStage__c,LatestMasterContract__r.contractlifecycle__r.LockUpStage__c,LatestMasterContract__r.contractlifecycle__r.FixStage__c,LatestMasterContract__r.contractlifecycle__r.FinalStage__c ,  LatestMasterContract__r.contractlifecycle__r.SettlementStage__c , LatestMasterContract__r.ListedProduct__r.producttype__c , LandRegistrationDateActual__c , LandRegistrationTitleDate_Forecast__c , IsProjectHorizon__c , LandFrontage__c , LandDepth__c , LandSize__c , Price__c , LatestMasterContract__r.Purchaser__r.FullName__c , LatestMasterContract__r.ContractReservationDate__c , LatestMasterContract__r.LandContract__r.ContractedDate__c , LatestMasterContract__r.PropertyContract__r.ContractedDate__c , LatestMasterContract__r.TotalDepositsPaidToDate__c , LatestMasterContract__r.TotalDepositsAmount__c , LatestMasterContract__r.TotalDepositBalanceDue__c , LatestMasterContract__r.ListedProduct__r.Bed_Bath_Car__c , LatestMasterContract__r.ListedProduct__r.HouseDesign__r.Name , LatestMasterContract__r.LandPropertyContractedDate__c , LatestMasterContract__r.FIRBpendingifapplicable__c , LatestMasterContract__r.LandContract__r.ProductSettledDate__c , LatestMasterContract__r.BuildContract__r.ProductSettledDate__c , LatestMasterContract__r.PropertyContract__r.ProductSettledDate__c , Stage__r.Entity__c , LatestMasterContract__r.LandContract__r.DateSoldDevNomura__c , LatestMasterContract__r.PropertyContract__r.DateSoldDevNomura__c , LatestMasterContract__r.LandContract__r.DepositDueDate__c , LatestMasterContract__r.PropertyContract__r.DepositDueDate__c , ForecastSiteStart__c from Product2 where  IsProjectHorizon__c = true  AND  ProductType__c = 'Land'" , //only horizon lots
  // HL1090_LOTS : "select id, Price__c, BaseLandLot__c from Product2 where ProductType__c = 'H+L 10/90' AND BaseLandLot__r.IsProjectHorizon__c = true AND ( Status__c = 'Available' OR Status__c = 'Withheld') "  // only horizon lots
  TITLED_LOTS : "select Id, Name, Project__r.Name , Stage__r.name, StatusDevr__c, LatestMasterContract__r.ContractSettlementDate__c , LatestMasterContract__r.TotalPackagePrice__c , LatestMasterContract__r.Name , LatestMasterContract__r.mastercontracttype__c , AllocationGroup__c , ProductAllocatedTo__c , LatestMasterContract__r.LandContractStatus__c , LatestMasterContract__r.BuildContractStatus__c , LatestMasterContract__r.PropertyContractStatus__c, LatestMasterContract__r.contractlifecycle__c, LatestMasterContract__r.contractlifecycle__r.SiteStartForecast__c , LatestMasterContract__r.contractlifecycle__r.SiteStartActual__c, LatestMasterContract__r.contractlifecycle__r.SlabStage__c,LatestMasterContract__r.contractlifecycle__r.FrameStage__c,LatestMasterContract__r.contractlifecycle__r.LockUpStage__c,LatestMasterContract__r.contractlifecycle__r.FixStage__c,LatestMasterContract__r.contractlifecycle__r.FinalStage__c ,  LatestMasterContract__r.contractlifecycle__r.SettlementStage__c , LatestMasterContract__r.ListedProduct__r.producttype__c , LandRegistrationDateActual__c , LandRegistrationTitleDate_Forecast__c , IsProjectHorizon__c , LandFrontage__c , LandDepth__c , LandSize__c , Price__c , LatestMasterContract__r.Purchaser__r.FullName__c , LatestMasterContract__r.ContractReservationDate__c , LatestMasterContract__r.LandContract__r.ContractedDate__c , LatestMasterContract__r.PropertyContract__r.ContractedDate__c , LatestMasterContract__r.TotalDepositsPaidToDate__c , LatestMasterContract__r.TotalDepositsAmount__c , LatestMasterContract__r.TotalDepositBalanceDue__c , LatestMasterContract__r.ListedProduct__r.Bed_Bath_Car__c , LatestMasterContract__r.ListedProduct__r.HouseDesign__r.Name , LatestMasterContract__r.LandPropertyContractedDate__c , LatestMasterContract__r.FIRBpendingifapplicable__c , LatestMasterContract__r.LandContract__r.ProductSettledDate__c , LatestMasterContract__r.BuildContract__r.ProductSettledDate__c , LatestMasterContract__r.PropertyContract__r.ProductSettledDate__c , Stage__r.Entity__c , LatestMasterContract__r.LandContract__r.DateSoldDevNomura__c , LatestMasterContract__r.PropertyContract__r.DateSoldDevNomura__c , LatestMasterContract__r.LandContract__r.DepositDueDate__c , LatestMasterContract__r.PropertyContract__r.DepositDueDate__c , ForecastSiteStart__c from Product2 where ProductType__c = 'Land' AND ( IsProjectHorizon__c = true OR LatestListedProduct__r.ProductType__c = 'H+L 10/90' ) AND ProductAllocatedTo__c != 'Build To Rent' AND ProductAllocatedTo__c != 'Channel - DHHS' AND ( NOT Project__r.Name  LIKE '%Harvest%' )  AND ( NOT Project__r.Name  LIKE '%Findon%' ) AND LatestMasterContract__r.BuildContractStatus__c != 'Settled' AND LatestMasterContract__r.PropertyContractStatus__c != 'Settled'   " ,
  HL1090_LOTS : "select id, Price__c, BaseLandLot__c from Product2 where ProductType__c = 'H+L 10/90' AND BaseLandLot__r.IsProjectHorizon__c = true AND ( Status__c = 'Available' OR Status__c = 'Withheld') " // all 10/90s
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

