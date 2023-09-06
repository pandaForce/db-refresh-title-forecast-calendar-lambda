const axios = require("axios");
const utilities = require("./utilities");
const custom_config = require("./config")

async function getData  ( call , data , url )  {
	console.log ( ' \n inside firebase_util.getData ')
	return new Promise(resolve => {
		axios(firebaseConfig ( call , url , data ) )
		.then(function (response) {
			resolve ( { statuscode : 200 , data : response.data } )
		})
		.catch(function (error) {
			resolve ( { "statuscode": 400, "data" : error.stack.toString() } )
		})
	})
}

async function getAuthToken ( api_key , user_name , pwd  ) {
	console.log ( ' \n inside firebase_util.getAuthToken ')
	return new Promise(resolve => {
		axios ( firebaseAuthConfig ( api_key , user_name , pwd )  )
		.then(function (response) {
			resolve ( { statuscode : 200 , data : response.data } )
		})
		.catch(function (error) {
			resolve ( { "statuscode": 400, "data" : error.stack.toString() } )
		})
	})

}

const firebaseConfig = ( call , url , data ) => {
	return {
		method: call,
		url: url,
		headers: { },
		data : data
	}

}

const firebaseAuthConfig = ( api_key , user_name , pwd ) => {
	return {
		method: 'post',
		url: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + api_key ,
		headers: { 'Content-Type': 'text/plain' } ,
		data : { 'email' : user_name , 'password' : pwd , 'returnSecureToken' : true } 
	}
}

module.exports.getData = getData
module.exports.getAuthToken = getAuthToken