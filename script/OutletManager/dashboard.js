import { OutletAPI } from "../API/OutletAPI.js";
import { requestAPI } from "../API/RequestAPI.js";
import { Outlet } from "../Modules/OutletModule.js";

$(document).ready(async function(){

    // Notification 
    var alertBox = $("#low-stock-alert");
    var allNotifications = await Outlet.populateNotification();
    if (allNotifications.length === 0) {
        alertBox.html(`<span class="no-alerts">No new alerts</span>`);
    } else {
        allNotifications.forEach(function(notification) {
            let alertsHtml = allNotifications.map(notification => 
                `<div class="alert-item">
                    <strong>${notification.notificationType}</strong> ${notification.message}
                </div>`
            ).join(""); // Convert notifications into HTML elements
    
            alertBox.html(alertsHtml); // Update the alert box
        });
    }

    // Populate Request Table
    let tableBody = $("#dashboard-table-body");
    tableBody.empty(); // Clear existing rows
    var data = await OutletAPI.gerRequestSummary();
    let rowHtml = `
        <tr>
            <td >${data.totalRequests}</td>
            <td >${data.pendingRequests}</td>
            <td >${data.deliveredRequests}</td>
            <td>${data.cancelledRequests}</td>
        </tr>
    `;

    tableBody.append(rowHtml);

    $("#manageRequest").click(async function(){
        showSection("manageRequests");
        await populateRequestTable("#manage-requests-table-body")
        $(document).on('click',".btnPayment",function(){
            showSection("paymentSection")
            var token = $(this).data("index");
            populatePayment(token)
        })

    })

    $("#payment").click(function(){
        showSection("paymentSection");
        $("#btnSearchToken").click(async function() {
            const token = $("#tokenSearch").val().trim();
            if (token === "") {
              alert("Please enter a token.");
              return;
            }
            populatePayment(token);
            
        })
    })
    $("#btnConfirmPayment").click(function() {
        if (!$("#emptyCollected").is(":checked")) {
          alert("Please confirm that the empty cylinders have been collected.");
          return;
        }
    })
})

function showSection(sectionId) {
    $("section").hide();              // Hide all sections
    $("#" + sectionId).show();        // Show the selected section
}

async function populatePayment(token) {
    var requestedToken = await requestAPI.getToken(token);
    if(requestedToken !=null){
        const total = requestedToken.qty * requestedToken.price;
        const row = `<tr>
        <td>${requestedToken.token}</td>
        <td>${requestedToken.userName}</td>
        <td>${requestedToken.gasName}</td>
        <td>${requestedToken.qty}</td>
        <td>${requestedToken.price}</td>
        <td>${total}</td>
        </tr>`;
        $("#paymentTable tbody").html(row);
    }else{
        alert("No payment details found for token: " + token);
        $("#paymentTable tbody").empty();
    }
    
}
async function populateRequestTable(tableBody){
    $(tableBody).empty();
    var requestList = await requestAPI.getAllRequestforOutlet();

    requestList.forEach(function(request, index) {
        var rowHtml = `<tr>
        <td>${request.token}</td>
        <td>${request.customer}</td>
        <td>${request.gasType}</td>
        <td>${request.gasName}</td>
        <td>${request.date}</td>
        <td>${request.status}</td>
        <td>
            <button class="btn-reschedule btn btn-success" data-index="${request.token}">Reschedule</button>
            <button class="btn-dispatch btn btn-warning btnPayment" data-index="${request.token}">Payment</button>
        </td>`
        $(tableBody).append(rowHtml);
    })

}
    
