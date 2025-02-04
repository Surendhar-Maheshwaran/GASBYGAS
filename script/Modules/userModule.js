import { userAPI } from "../API/userAPI.js";

export const user = {
    userData :{},
    login : async function(username, password){
        const loginData = {
            username: username,
            password : password
        }
        try{
            return await userAPI.login(loginData);
        }catch(error){
            alert(error.responseText);
        }
        
    },

    getOtpForConsumer : async function(firstname,lastname,address,phoneNo, email,
        password,username,outletID) {
        this.userData = {
            firstName : firstname,
            lastName :lastname,
            address : address,
            phoneNo : phoneNo,
            email : email,
            userPassword : password,
            userRole : "CONSUMER",
            nic : username,
            outletID : outletID
        }
        try{
            return await userAPI.getOTP(email);
        }catch(error){
            return error.responseText;
        } 
    },

    getOtpForIndustry : async function(organizationName,address, phoneNo, email, password,certificateImg,businessRegNo,outletID,){
        this.userData = {
            firstName : organizationName,
            lastName : "",
            address : address,
            phoneNo : phoneNo,
            email : email,
            userPassword : password,
            userRole : "INDUSTRIAL",
            certificateImg : certificateImg,
            businessRegNo : businessRegNo,
            outletID : outletID
        }
        try{
            return await userAPI.getOTP(email);
        }catch(error){
            return error.responseText;
        } 
    },
    getOtpForManager : async function(managerName,address, phoneNo, email,password, outletID) {
        this.userData = {
            firstName : managerName,
            address : address,
            phoneNo : phoneNo,
            email : email,
            userPassword : password,
            userRole : "UserDTO",
            outletID : outletID
        }
        try {
            return await userAPI.getOTP(email);
        } catch (error) {
            return error.responseText;
        }
    },

    register : async function(otp) {
        try{
            return await userAPI.register(this.userData,otp);
        }catch(error){
            return error.responseText;
        }
        
    },

    sendRequest : async function(outletID,gasID,qty,userID){
        const requestData = {
            userID :userID,
            outletID : outletID,
            gasID : gasID,
            noOfGas : qty
        }
        try{
            return await userAPI.sendRequest(requestData);
        }catch(error){
            alert(error);
            return null;
        }
    },

    getAllRequest : async function(){
        try {
            return await userAPI.getAllRequest();
        } catch (error) {
            alert(error);
            return null;
        }
    },

    getUserDetails : async function(userID){
        try{
            const userDetails = await userAPI.getUserDetails(userID);
            return userDetails;
        }catch(error){
            alert(error);
            return null;
        }
    },

    getAllNotifications : async function(userID){
        try{
            const notifications = await userAPI.getAllNotifications(userID);
            return notifications;
        }catch(error){
            alert(error);
            return null;
        }
    }
}