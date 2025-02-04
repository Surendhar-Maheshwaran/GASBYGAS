
import { requestAPI } from "../API/RequestAPI.js";
import { user } from "./userModule.js";

export const Request = {
    PopulateRequestTable : async function(tableID) {
        var requestList = await user.getAllRequest();
        requestList.forEach(token => {
          const row = `
                  <tr>
                    <td>${token.tokenID}</td>
                    <td>${token.gasName}</td>
                    <td>${token.quantity}</td>
                    <td>${token.outletName}</td>
                    <td>"2 weeks"</td>
                    <td>${token.status}</td>
      
                  </tr>
                `;
                $(tableID).append(row);
        });
    },

    getRequestByID : async function(userID){
      try{
        var total = await requestAPI.getTotalRequestByID(userID);
        return total;
      }catch(error){
        return null;
      }

    }
}