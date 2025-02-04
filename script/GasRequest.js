import { auth } from "./auth.js";
import { Gas } from "./Modules/GasModule.js"
import { Outlet } from "./Modules/OutletModule.js";
import { user } from "./Modules/userModule.js";

$(document).ready(async function(){
    await Gas.populateDropdown('#cylinderType');
    await Outlet.populateDropDownAfterLogin("#outlet")


    $("#btnRequest").on('click',async function(e){
        e.preventDefault();
        var userID = auth.getUserID();
        var outletID = $("#outlet").val();
        var gasID = $("#cylinderType").val();
        var qty = $("#quantity").val();
        var request = await user.sendRequest(outletID,gasID,qty,userID);
        return request;
    })
})
