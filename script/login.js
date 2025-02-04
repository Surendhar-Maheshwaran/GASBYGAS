import { auth } from "./auth.js";
import { user } from "./Modules/userModule.js";

$(document).ready(function(){
    $("#btnLogin").on("click", async function(){
        const username = $("#txtEmail").val();
        const password = $("#txtPassword").val();

        if (!username || !password) {
            alert("Please enter both username and password.");
            return;
        }
        const authToken = await user.login(username,password);
        if(authToken.status == 200){

            localStorage.setItem("authToken",authToken.responseText);
            var userRole = auth.getUserRole();
            alert(userRole);
            if(userRole == "CONSUMER"){
                window.location.href ="consumer.html";
            }
            if(userRole == "INDUSTRIAL"){
                window.location.href = "./industry/dashboard.html";
            }
            if(userRole == "ADMIN"){
                window.location.href = "./Distribution/dashboard.html";
            }
            if(userRole == "OUTLETMANAGER"){
                window.location.href = "./OutletManager/dashboard.html";
            }
        }else{
            alert(authToken.responseText)
        } 
    })

})


