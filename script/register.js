import { Outlet } from "./Modules/OutletModule.js";
import { user } from "./Modules/userModule.js";

$(document).ready(function(){
    // Loading corresponding forms in the container
    $("#btnConsumer").click(function() {
        $("#formContainer").load("consumerRegistration.html",function(){
            Outlet.populateDropDown('.outlet');
            $("#btnConsumerRegister").on('click',function(e){
                e.preventDefault();
                registerAsConsumer();                    
            });
        })
    });

    $("#btnIndustry").click(function() {
        $("#formContainer").load("industryRegistration.html",function(){
            Outlet.populateDropDown('.outlet');
            $("#btnRegisterIndustry").on('click',function(e){
                e.preventDefault();
                registerAsIndustry();
            })    
        });
    });

    $("#btnOutlet").click(function(){
        $("#formContainer").load("outletRegistration.html",function(){
            $("#btnOutletRegister").on('click', function(e){
                e.preventDefault();
                alert("reg")
                registerAsOutlet();
            })
        })
    })
})


async function load(page){
    $("#formContainer").load(page,function(){
        $("#btnVerifyOTP").on('click', async function(e){
            e.preventDefault(); // Prevent form submission
            var otp = '';
            // Get the OTP as a string
               $('.otp-input').each(function() {
                   otp += $(this).val(); // Concatenate each OTP digit
               });
   
               // Now you have the OTP as a string
               console.log("OTP:", otp); // Display OTP in the console
            try {
                var response = await user.register(otp);
                alert(response.status);
                if(response.status == 201){
                    window.location.href = "login.html"
                } 
            } catch (error) {
                return error.responseText;
            }
            
        }); 
    });
}

async function registerAsOutlet(){
    var outletName = $("#outletName").val();
    var outletAddress = $("#outletAddress").val();
    var outletDistrict = $("#outletDistrict").val();
    var phoneNo = $("#outletPhoneNo").val();
    var managerName = $("#managerName").val();
    var email = $("#email").val();
    var password = $("#password").val();
    var confirmPassword = $("#confirmPassword").val();

    if(password == confirmPassword){
        var outletRegistration = await Outlet.registerOutlet(outletName,outletAddress,outletDistrict,phoneNo);
        if(outletRegistration.status == 200){
            var outletID = outletRegistration.responseText;
            alert(outletID);
            var emailStatus = await user.getOtpForManager(managerName,outletAddress,phoneNo,email,password,outletID);
            alert(emailStatus.status);
            if(emailStatus.status == 200){
                load("otpPage.html");
            }else{
                Outlet.delete(outletID);
                alert(emailStatus.responseText);
            }
        }
    }
}

async function registerAsIndustry(){
    var organizationName = $("#organizationName").val();
    var address = $("#address").val();
    var phoneNo = $("#phoneNo").val();
    var email = $("#email").val();
    var password = $("#password").val();
    var confirmPassword = $("#confirmPassword").val();
    var businessRegNo = $("#businessRegNo").val();
    var certificateImg = "img ";
    var outlet = $(".outlet").val();

    if(password == confirmPassword){
        try {
            var emailStatus =  await user.getOtpForIndustry(organizationName,address,phoneNo,email,
                password,certificateImg,businessRegNo,outlet);
            alert(emailStatus.responseText);
            if(emailStatus.status == 200){
                load("otpPage.html");
            }
        } catch (error) {
            alert(error)
        }
       
    }else{
        alert("Passwords Does not Match");
    }
}

async function registerAsConsumer() {
    // Storing the field values in the variable
    var firstname = $("#firstName").val();
    var lastname = $("#lastName").val();
    var address = $("#address").val();
    var phoneNo = $("#phoneNo").val();
    var email = $("#email").val();
    var password = $("#password").val();
    var confirmPassword = $("#confirmPassword").val();
    var nic = $("#nic").val();
    var outlet = $(".outlet").val();

    if(password == confirmPassword){
        var emailStatus =  await user.getOtpForConsumer(firstname,lastname,
            address,phoneNo,email,password,nic,outlet
        );
        alert(emailStatus.responseText);
        if(emailStatus.status == 200){
            load("otpPage.html");
        }
    }else{
        alert("Passwords Does not Match");
    }
}
