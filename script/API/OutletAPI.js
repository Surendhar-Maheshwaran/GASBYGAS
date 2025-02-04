import { auth } from "../auth.js";

export const OutletAPI = {
    authToken : localStorage.getItem('authToken'),

    getregisteredOutlet : function(){
        try {
            alert(this.authToken)
            var outlet = $.ajax({
                url : `http://localhost:8080/api/user/getregisteredOutlet/${auth.getUserID()}`,
                type : 'GET',
                headers :{
                    'Authorization' : `Bearer ${this.authToken}`
                }
            }) 
            return outlet;
        } catch (error) {
            if (error.responseText) {
                throw new Error(error.responseText);
            } else {
                throw new Error("An unexpected error occurred.");
            }
        }
    },

    getAllOutlet : function(){
        try{
            var outletList = $.ajax({
                url : `http://localhost:8080/api/outlet/getAll`,
                type : 'GET'
            })
            return outletList;
        }catch (error) {
            if (error.responseText) {
                throw new Error(error.responseText);
            } else {
                throw new Error("An unexpected error occurred.");
            }
        }
    },

    register : async function(outletData){
        try{
            var registeredOutlet = await $.ajax({
                url : `http://localhost:8080/api/outlet/register`,
                type : 'POST',
                contentType : "application/json",
                data : JSON.stringify(outletData)
            })
            return {status : 200, responseText : registeredOutlet};
        }catch (error) {
            if (error.responseText) {
                throw new Error(error.responseText);
            } else {
                throw new Error("An unexpected error occurred.");
            }
        }
    },

    delete : async function(outletID){
        try{
            var deletedOutlet = await $.ajax({
                url : `http://localhost:8080/api/outlet/delete/${outletID}`,
                type : 'DELETE',
                headers :{
                    'Authorization' : `Bearer ${this.authToken}`
                }
            })
            return {status : 200, message : registeredOutlet};
        }catch (error) {
            if (error.responseText) {
                throw new Error(error.responseText);
            } else {
                throw new Error("An unexpected error occurred.");
            }
        }
    },

    loadNotifications : async function() {
        return await $.ajax({
            url: `http://localhost:8080/api/notification/getAll/${auth.getUserID()}`,
            method: "GET",
            headers :{
                'Authorization' : `Bearer ${this.authToken}`
            }
        })
    },

    gerRequestSummary : async function(){
        var outletId = 1;
        return await $.ajax({
            url: `http://localhost:8080/api/request/getRequestSummary/${outletId}`,
            method: "GET",
            headers :{
                'Authorization' : `Bearer ${this.authToken}`
            }
        })
    }
}