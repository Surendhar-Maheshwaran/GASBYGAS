import { auth } from "../auth.js";
import { Gas } from "../Modules/GasModule.js";
import { Outlet } from "../Modules/OutletModule.js";
import { Request } from "../Modules/RequestModule.js";
import { user } from "../Modules/userModule.js";

$(document).ready(async function () {
    // Check whether the user is authenticated
    if(!auth.isAuthenticated()){
        window.location.href = "../login.html"
    }
    var userID = auth.getUserID();
    var userDetails = await user.getUserDetails(userID);
    $("#welcome").text("Welcome, " + userDetails.firstName)

    var totalCylinders = await Request.getRequestByID(userID);
    if(totalCylinders == null){
        $("#totalCylinders").text(0);
    }else{
        $("#totalCylinders").text(totalCylinders);
    }


    // Event handler for navigation links
    $(".nav a").on("click", function (e) {
        e.preventDefault(); // Prevent default link behavior

        // Get the target page URL from the link's href attribute
        const pageUrl = $(this).attr("href");
        if(pageUrl == "dashboard.html"){
            window.location.href = pageUrl;
        }

        // Load the content dynamically into the main container
        $(".main-container").fadeOut(200, function () {
            $(".main-container").load(pageUrl, function () {
                $(".main-container").fadeIn(200);
            });
        });

        // Update active class for navigation links
        $(".nav a").removeClass("active");
        $(this).addClass("active");
    });
    
    $("#btnBulkGas").on('click', function(){
        $(".main-container").fadeOut(200, function () {
            $(".main-container").load("requestGas.html", function () {
                $(".main-container").fadeIn(200);
                Outlet.populateDropDown("#OutletDropdown")
                Gas.populateDropdown("#gasType")

                $("#btnRequest").on('click',async function(e){
                    e.kpreventDefault();
                    var userID = auth.getUserID();
                    var outletID = $("#OutletDropdown").val();
                    var gasID = $("#gasType").val();
                    var qty = $("#quantity").val();
                    var request = await user.sendRequest(outletID,gasID,qty,userID);
                    return request;
                })
            });
        });
    })

    $("#btnToken").on('click',function(){
        $(".main-container").fadeOut(200,function(){
            $(".main-container").load("tokens.html", function () {
                $(".main-container").fadeIn(200);
                Request.PopulateRequestTable("#requestTable")
            })
        })
    })

    $("#btnProfile").on('click', function(){
        $(".main-container").fadeOut(200,function(){
            $(".main-container").load("profile.html", async function () {
                $(".main-container").fadeIn(200);
                var userDetails = await user.getUserDetails(auth.getUserID());
                $("#orgName").val(userDetails.firstName);
                $("#contact").val(userDetails.phoneNo);
                $("#address").text(userDetails.address);
            })
        })
    })
})