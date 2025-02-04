import {auth} from "./auth.js";
import { Request } from "./Modules/RequestModule.js";
import { user } from "./Modules/userModule.js";


$(document).ready(async function () {
  if (!auth.isAuthenticated()) {
    // Redirect to login if not authenticated
    window.location.href = "login.html";
  }
  var userID = auth.getUserID();
  var userDetails = await user.getUserDetails(userID);
  $("#welcome").text("Welcome, " + userDetails.firstName)

  $(".nav-link").on("click", function (e) {
    e.preventDefault();
    // Get the page to load from the data-page attribute
    const page = $(this).data("page");
    if ($(this).text().trim() === "Home") {
        window.location.href = page; // Navigate to the Dashboard normally
        return; // Exit the function
    }
    if ($(this).text().trim() === "Logout") {
        return;
    }

    if (page) {
      $("#main-content").load(page, function () {
        if (page === "token_management.html") {
          Request.PopulateRequestTable("#tokenTableBody");
        }
      })
    }
    if (page) {
      $("#main-content").load(page, function () {
          if (page === "notification.html") {
              var notifications = user.getAllNotifications(userID);
              $("#notificationList").empty();

              if (notifications.length === 0) {
                  $("#notificationTable").hide();
                  $("#noNotificationsMessage").show();
              } else {
                  $("#notificationTable").show();
                  $("#noNotificationsMessage").hide();

                  $(notifications).each(function (index, notification) {
                      var row = `
                          <tr>
                              <td>${notification.id}</td>
                              <td>${notification.message}</td>
                              <td>${notification.type}</td>
                              <td>${notification.status}</td>
                              <td>${notification.createdAt}</td>
                              <td>${notification.sentAt}</td>
                          </tr>
                      `;
                      $("#notificationList").append(row);
                  });
              }
          }
      });
  }
  })

  // Logout Functionality
  $("#btnLogout").on('click',function(){
    $('#logout-modal').modal('show');
  })

  // Confirm logout
  $('#confirm-logout').on('click', function () {
    localStorage.removeItem('authToken');
    window.location.href = '/login.html';
  })

})
