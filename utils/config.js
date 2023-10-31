require("dotenv").config();

const IS_PRODUCTION = true
const APP_NAME = 'Sales Report'
const ENVIRONMENT = IS_PRODUCTION ? 'Production' : 'Sandbox' 

const APP_SOQL = 
{
    ENQUIRIES : "select ProjectEnquiredOn__r.Name, CreatedDate, Id, UTM_Source__c, UTM_Medium__c, UTM_Campaign__c, UTM_Term__c, UTM_Content__c, EnquiryURL__c, CloseEnquiryReason__c, BuyerProfile__c, Contact__r.MailingPostalCode, BuyerPriceRange__c, BuyingTimeframe__c, NoofBedrooms__c,  NoofBathrooms__c, Contact__r.FullName__c, Contact__r.Email, Contact__r.MobilePhone, ContactEnquiryComments__c, LatestActivityOnEnquiry__c, Owner.Name, Name, EnquirySource__c, EnquiryType__c, EnquiryQualityStatus__c, EnquiryStatus__c, ENQActivityCalls__c, ENQActivityEmails__c, ENQActivityMissedCalls__c, ENQActivityAppointmentsScheduled__c, ENQActivityAppointments__c, AppointmentDateTime__c, AppointmentHeldDate__c from Enquiry__c where CreatedDate >= 2023-01-01T00:00:00.000Z AND EnquiryType__c = 'Local' and (EnquirySource__c != 'Channel' AND EnquirySource__c != 'Non Marketing Lead') AND ( (Not MasterContract__r.listingallocatedtor__c Like '%Channel%') or (Not MasterContract__r.listingallocatedtor__c Like '%Resimax - Hyde%') or (Not MasterContract__r.listingallocatedtor__c Like '%Nominated%')) and Contact__c != null and isDeleted = false",
    MY_EVENTS : "select id, Enquiry__r.ProjectEnquiredOn__r.Name, Enquiry__r.EnquiryType__c , Owner.Name, Name, MasterContract__r.Name, MasterContract__r.LotUnitNumber__c, Note__c, Contact__r.FullName__c, Enquiry__r.Name, MyEventType__c, createdDate , MyEventTitle__c , ContactedMethod__c , Enquiry__c from MyEvent__c where createdDate >= 2023-01-01T00:00:00.000Z AND Owner.Name != 'B2BMA Integration' AND Enquiry__c != null",
}

const FIREBASE = {
    RTDB_BASE : 'https://sales-report-c1382-default-rtdb.asia-southeast1.firebasedatabase.app' ,
    RTDB_VAR : '/enquiries.json',
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

