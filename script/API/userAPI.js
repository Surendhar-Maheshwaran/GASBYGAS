import { auth } from "../auth.js";

export const userAPI = {
    authToken : localStorage.getItem('authToken'),

    url : "http://localhost:8080/api/user/",
    login : async function(loginData){
        try {
            var response =  await $.ajax({
                url: `http://localhost:8080/api/user/login`,
                type:'POST',
                contentType : "application/json",
                data : JSON.stringify(loginData),
            })
            return {status : 200 , responseText : response};
        }catch (error) {
            console.error("Error occurred:", error.responseText);
    
            // Check if error has a responseText
            if (error.responseText) {
                return {status : error.status, responseText : error.responseText}; // Backend error message
            } else {
                throw new Error("An unexpected error occurred.");
            }  
        }
    },

    getOTP : async function(email){
        localStorage.removeItem('authToken');
        try{
            var response = await $.ajax({
                url : "http://localhost:8080/api/user/verifyEmail",
                type : "POST",
                contentType : "application/json",
                data : JSON.stringify({email:email})
            });
            return {status : 200 , message : response};
        }catch(error){
            if (error.responseText) {
                return {status : error.status, responseText : error.responseText}; // Backend error message
            } else {
                throw new Error("An unexpected error occurred.");
            }  
        }
    },

    getUserDetails : async function(userID) {
        try{
            const userDetails = await $.ajax({
                url : `http://localhost:8080/api/user/getDetails/${userID}`,
                type : 'GET',
                headers : {'Authorization' : `Bearer ${this.authToken}`}
            })
            return userDetails;
        }catch(error){
            if (error.responseText) {
                throw new Error(error.responseText); 
            } else {
                throw new Error("An unexpected error occurred.");
            }  
        }   
    },

    register : async function(userData,otp) {
        localStorage.removeItem('authToken');
        try{
            var response = await $.ajax({
                url: `http://localhost:8080/api/user/registerUser/${otp}`,
                type:'POST',
                contentType : "application/json",
                data : JSON.stringify(userData)  
            })
            return {status : 201, responseText : response};
        }catch(error){
            if (error.responseText) {
                throw new Error({status : error.status, responseText : error.responseText}); // Backend error message
            } else {
                throw new Error("An unexpected error occurred.");
            }  
        }
    },

    sendRequest : async function(requestData){
        try{
            var token = await $.ajax({
                url: `http://localhost:8080/api/request/gas`,
                type:'POST',
                contentType : "application/json",
                headers : {'Authorization' : `Bearer ${this.authToken}`},
                data : JSON.stringify(requestData)  
            })
            return token;
        }catch(error){
            if (error.responseText) {
                throw new Error(error.responseText); 
            } else {
                throw new Error("An unexpected error occurred.");
            }  
        }   
    },

    getAllRequest : async function(){
        try{
            var requestList = await $.ajax({
                url: `http://localhost:8080/api/request/getAll/${auth.getUserID()}`,
                type:'GET',
                headers : {'Authorization' : `Bearer ${this.authToken}`}
            })
            return requestList;
        }catch(error){
            if (error.responseText) {
                throw new Error(error.responseText); 
            } else {
                throw new Error("An unexpected error occurred.");
            }  
        }   
    },

    getAllNotifications : async function(){
        try{
            var notificationList = await $.ajax({
                url: `http://localhost:8080/api/notification/getAll/${auth.getUserID()}`,
                type:'GET',
                headers : {'Authorization' : `Bearer ${this.authToken}`}
            })
            return notificationList;
        }catch(error){
            if (error.responseText) {
                throw new Error(error.responseText); 
            } else {
                throw new Error("An unexpected error occurred.");
            } 
        }
    },

    getAllUser : async function(){
        try{
            var usersList = await $.ajax({
                url: `http://localhost:8080/api/user/getAllUser`,
                type:'GET',
                headers : {'Authorization' : `Bearer ${this.authToken}`}
            })
            return usersList;
        }catch(error){
            if (error.responseText) {
                throw new Error(error.responseText); 
            } else {
                throw new Error("An unexpected error occurred.");
            } 
        }
    },

    verifyUser : async function(userID) {
        try{
            var verifiedUser = await $.ajax({
                url: `http://localhost:8080/api/user/verify/${userID}`,
                type:'PUT',
                headers : {'Authorization' : `Bearer ${this.authToken}`}
            })
            return verifiedUser;
        }catch(error){
            if (error.responseText) {
                throw new Error(error.responseText); 
            } else {
                throw new Error("An unexpected error occurred.");
            } 
        }
        
    }
}