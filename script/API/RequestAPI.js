import { auth } from "../auth.js";

export const requestAPI = {
    authToken : localStorage.getItem('authToken'),
    getTotalRequestByID : async function(userID){
        try{
            return $.ajax({
                url : `http://localhost:8080/api/request/getTotal/${userID}`,
                type : 'GET',
                headers :  {'Authorization' : `Bearer ${this.authToken}`}
            })
        }catch(error){
            alert(error);
        }
    },

    getFullRequestSummary : async function(){
        try{
            return await $.ajax({
                url : `http://localhost:8080/api/request/get/fullSummary`,
                type : 'GET',
                headers :  {'Authorization' : `Bearer ${this.authToken}`}
            })
        }catch(error){
            alert(error.responseText);
        }
    },

    getRequestTotal : async function(){
        try{
            return await $.ajax({
                url : `http://localhost:8080/api/request/getTotal`,
                type : 'GET',
                headers :  {'Authorization' : `Bearer ${this.authToken}`}
            })
        }catch(error){
            alert(error.responseText);
        }
    },

    getOutletRequests : async function() {
        try{
            return await $.ajax({
                url : `http://localhost:8080/api/request/get/totalByOutlet`,
                type : 'GET',
                headers :  {'Authorization' : `Bearer ${this.authToken}`}
            })
        }catch(error){
            alert(error.responseText);

        }
    },

    getAllRequestforOutlet : async function(){
        try{
            return await $.ajax({
                url : `http://localhost:8080/api/request/getAllByOutlet/${auth.getUserID()}`,
                type : 'GET',
                headers :  {'Authorization' : `Bearer ${this.authToken}`}
            })
        }catch(error){
            alert(error);

        }
    },

    getToken : async function(token){
        try {
            return await $.ajax({
                url : `http://localhost:8080/api/request/getByToken/${token}`,
                type : 'GET',
                headers :  {'Authorization' : `Bearer ${this.authToken}`}
            })
        } catch (error) {
            
        }
    }

}