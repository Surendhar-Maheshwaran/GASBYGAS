import { OutletAPI } from "../API/OutletAPI.js";

export const Outlet = {
    populateDropDown : async function(populateField){
        var outletList = await OutletAPI.getAllOutlet();
        outletList.forEach(outlet => {
            $(populateField).append(
                `<option value="${outlet.outletID}">${outlet.outletName}</option>`
            );
        }); 
    },

    populateDropDownAfterLogin :async function(populateField){
        var outlet = await OutletAPI.getregisteredOutlet();
        $(populateField).append(`<option value="${outlet.outletID}">${outlet.outletName}</option>`)
    }, 

    registerOutlet : async function(outletName, address,district, phoneNo) {
        var outletData = {
            outletName : outletName,
            address : address,
            district : district,
            phoneNo : phoneNo
        }
        try {
            return await OutletAPI.register(outletData);
        } catch (error) {
            return {status : error.status, responseText : error.responseText};
        }
    },

    populateNotification : async function(){
        try {
            return await OutletAPI.loadNotifications();
        } catch (error) {
            return error.responseText;
        }
    }
}