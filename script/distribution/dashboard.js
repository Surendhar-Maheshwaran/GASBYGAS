import { DispatchAPI } from "../API/DispatchAPI.js";
import { GasAPI } from "../API/GasAPI.js";
import { requestAPI } from "../API/RequestAPI.js";
import { userAPI } from "../API/userAPI.js";
import { Gas } from "../Modules/GasModule.js";
import {Outlet} from "../Modules/OutletModule.js";
$(document).ready(async function () {
    let currentPage = ""; 
    populatePieChart("#pieChart");
    populateStockTable("#stock-table-body");
    populateRequestStatus("#request-status-body");
    $("#btnLogout").on('click',function(){
        $('#logout-modal').modal('show');
      })
    
      // Confirm logout
      $('#confirm-logout').on('click', function () {
        localStorage.removeItem('authToken');
        window.location.href = '../login.html';
      })


    $("#total").text(await requestAPI.getRequestTotal())

    $(".nav a").on("click", function (e) {
        e.preventDefault();

        // Get the target page URL from the link's href attribute
        const pageUrl = $(this).attr("href");
        if ($(this).text().trim() === "Dashboard") {
            window.location.href = pageUrl; // Navigate to the Dashboard normally
            return; // Exit the function
        }

        // Check if the requested page is already loaded
        if (pageUrl == currentPage) {
            return; // Exit if the page is already loaded
        }

        // Update the current page
        currentPage = pageUrl;

        // Load the content dynamically into the main container
        $(".main-container").fadeOut(200,  function () {
            $(".main-container").load(pageUrl,  async function () {
                $(".main-container").fadeIn(200);
                if(pageUrl == "stockManagement.html"){
                    $("#btnAddNewGas").on('click',async function(e){
                        e.preventDefault();
                        var gasType = $("#gasType").val();
                        var gasName = $("#gasName").val();
                        var gasSize = $("#gasSize").val();
                        var price = $("#price").val();
                        var qty = $("#quantity").val();
                        var savedGas = await Gas.addNew(gasType,gasName,gasSize,price,qty);
                        if(savedGas != null){
                            alert(savedGas);
                            $("#gasType").val("");
                            $("#gasName").val("");
                            $("#gasSize").val("");
                            $("#price").val("");
                            $("#quantity").val("");
                            return
                        }
                        alert("Gas Has been not Added to the System");

                    })
                }

                if(pageUrl == "deliverySchdeule.html"){
                    Outlet.populateDropDown("#outlet");
                    Gas.populateDropdown("#gas-name");
                    populateScheduleTable("#schedule-table-body");
                    var gasId = 0;
                    $("#add-to-table").click(function() {
                        addToTable();
                    });
                    // Remove row when clicking "Remove" button
                    $(document).on("click", ".remove-btn .btn btn-danger", function() {
                        $(this).closest("tr").remove();
                    });
                
                    $("#create-schedule").click(async function() {
                        createSchedule();  
                    })

                    $(document).on('click',"#btnDispatch",async function(){
                        var dispatchID = $(this).data("index");
                        var dispatch =await DispatchAPI.dispatchOrder(dispatchID);
                        alert(dispatch);
                    })
                }

                if(pageUrl == "userManagement.html"){
                    populateUsersTable("#userTable");
                    $(document).on("click", ".btn-verify", function() {
                        var userId = $(this).data("userid");
                        var userName = "John Doe";
                        var userEmail = "john.doe@example.com";
                        var certificateUrl = "https://via.placeholder.com/300x200.png?text=User+Certificate";
                        
                        // Populate the modal fields
                        $("#modalUserName").text(userName);
                        $("#modalUserEmail").text(userEmail);
                        $("#userCertificate").attr("src", certificateUrl);
                        
                        // Optionally, store the userId on the modal for later use if needed
                        $("#verifyModal").data("userid", userId);
                        
                        // Show the Verify Modal
                        $("#verifyModal").modal("show");
                        $("#confirmVerify").on('click', async function(){
                            var verifiedUser = await userAPI.verifyUser(userId);
                            alert(verifiedUser);
                        })
                    })
                }
                if(pageUrl == "manageRequest.html"){
                    populateRequestTable("#request-table");
                    $("#searchInput").on("keyup", function() {
                        // Get the value of the input, converted to lower case for case-insensitive search
                        var value = $(this).val().toLowerCase();
                        
                        // Filter the table rows
                        $("#request-table tr").filter(function() {
                          // Toggle the visibility based on whether the row text contains the search value.
                          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
                        });
                      });

                }
            });
            // Update active class for navigation links
            $(".nav a").removeClass("active");
            $(this).addClass("active");
        });
    })
})

async function populatePieChart(piechartID){
    const ctx = $(piechartID)[0].getContext('2d');
    var requests = await requestAPI.getFullRequestSummary();
    const approved = requests.totalRequests;
    const pending = requests.pendingRequests
    const completed = requests.completedRequests 
    const cancelled = requests.cancelledRequests
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Approved', 'Pending', 'Completed','Cancelled'],
            datasets: [{
                data: [approved, pending, completed,cancelled],
                backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
            },
        },
    });
}

function addToTable(){
    let outlet = $("#outlet option:selected").text();
    let deliveryDate = $("#delivery-date").val();
    let gasName = $("#gas-name option:selected").text();
    let gasID = $("#gas-name").val();
    let quantity = $("#quantity").val();

    if (outlet && deliveryDate && gasName && quantity) {
        let newRow = `<tr>
            <td>${outlet}</td>
            <td>${deliveryDate}</td>
            <td class="gas-name" value="${gasID}">${gasName}</td>
            <td class="gas-qty">${quantity}</td>
            <td><button class="remove-btn btn btn-danger">Remove</button></td>
        </tr>`;

        $("#schedule-table tbody").append(newRow);

        // Clear input fields
        $("#gas-name").val("");
        $("#quantity").val("");
    } else {
        alert("Please fill all fields before adding.");
    } 
}

async function createSchedule(){
    let gasItems = [];

    $("#schedule-table tbody tr").each(function() {
        let row = $(this).find("td");
        let gasId = $(this).find(".gas-name").attr("value");
        const qty = parseInt($(this).find(".gas-qty").text(), 10);
        gasItems.push({ gasID: parseInt(gasId, 10), gasQty: qty });
    });

    if (gasItems.length > 0) {
        let totalQty = 0;
        gasItems.forEach(item => totalQty += item.gasQty);
        // Create a JSON object to send to backend
        var outletId = $("#outlet").val();
        const dispatchData = {
            outletID: parseInt(outletId, 10),
            deliveryDate: $("#delivery-date").val(),
            dispatchQty: totalQty,
            dispatchGas: gasItems
        };
        var dispatch = await DispatchAPI.addNewDispatch(dispatchData);
        alert(dispatch);
    }
}

async function populateScheduleTable(tableBody){
    $(tableBody).empty();
    var deliveries = await DispatchAPI.getAll();
    deliveries.forEach(function(delivery, index) {
        var rowHtml = `<tr>
            <td>${delivery.outletID}</td>
            <td>${delivery.deliveryDate}</td>
            <td>${delivery.dispatchQty}</td>
            <td>${delivery.dispatchStatus}</td>
            <td>
                <button class="btn-reschedule btn btn-success" data-index="${index}">Reschedule</button>
                <button class="btn-dispatch btn btn-warning" id="btnDispatch" data-index="${index}">Dispatch</button>
            </td>
        </tr>`;
        $(tableBody).append(rowHtml);
    })
}

async function populateStockTable(populateTableID) {
    $(populateTableID).empty();
    var allGases = await GasAPI.getAllGas();
    allGases.forEach(function(gas,index){
        var rowHtml = `<tr>
            <td>${gas.gasType}</td>
            <td>${gas.gasName} - ${gas.gasSize}</td>
            <td>${gas.qty}</td>
        </tr>`;
        $(populateTableID).append(rowHtml);
    })
}

async function populateRequestStatus(populateTableID){
    $(populateTableID).empty();
    var requests = await requestAPI.getFullRequestSummary();
    var rowHtml = 
        `<tr>
            <td>Total Requests</td>
            <td>${requests.totalRequests}</td>
        </tr>
        <tr>
            <td>Pending Requests</td>
            <td>${requests.pendingRequests}</td>
        </tr>
        <tr>
            <td>Completed Requests</td>
            <td>${requests.completedRequests}</td>
        </tr>
        <tr>
            <td>Cancelled Requests</td>
            <td>${requests.cancelledRequests}</td>
        </tr>`
        $(populateTableID).append(rowHtml);
}

async function populateUsersTable(populateTableID) {
    $(populateTableID).empty();
    var allUsers = await userAPI.getAllUser();
    allUsers.forEach(function(user,index){
        let disableOrEnableButton = "";
        if (user.userRole && user.userRole.toLowerCase() === "disabled") {
            disableOrEnableButton = `<button class="btn-enable btn btn-sm btn-success" data-userid="${user.userID}">Enable</button>`;
        } else {
            disableOrEnableButton = `<button class="btn-disable btn btn-sm btn-danger" data-userid="${user.userID}">Disable</button>`;
        }

        let verifyOrUnverifyButton = "";
        if (user.userStatus && user.userStatus.toLowerCase() === "pending") {
            verifyOrUnverifyButton = `<button class="btn-verify btn btn-sm btn-success" data-userid="${user.userID}">Verify</button>`;
        } else {
            verifyOrUnverifyButton = `<button class="btn-disable btn btn-sm btn-danger" data-userid="${user.userID}">Unverify</button>`;
        }

        var rowHtml = `<tr>
            <td>${user.firstName}</td>
            <td>${user.phoneNo}</td>
            <td>${user.userStatus}</td>
            <td>${user.userRole}</td>
            <td>
                ${disableOrEnableButton} ${verifyOrUnverifyButton}
            </td>
            
        </tr>`;
        $(populateTableID).append(rowHtml);
    })
}

async function populateRequestTable(populateTableID){
    $(populateTableID).empty();
    var requestList = await requestAPI.getOutletRequests()
    requestList.forEach(function(request){
        var rowHtml = `<tr>
            <td>${request.outletName}</td>
            <td>${request.gasName}</td>
            <td>${request.noOfGas}</td>
        </tr>`;
        $(populateTableID).append(rowHtml);
    })
}