import { GasAPI } from "../API/GasAPI.js"

export const Gas = {
    populateDropdown : async function(populateField){
        var listOfGas = await GasAPI.getAllGas();
        listOfGas.forEach(gas => {
            $(populateField).append(
                `<option value="${gas.gasID}">${gas.gasName} - ${gas.gasSize}</option>`
            );
        });
    },

    addNew : async function(gasType,gasName, gasSize, price, qty){
        var gasData = {
            gasType : gasType,
            gasName : gasName,
            gasSize :gasSize,
            price : price,
            qty : qty
        }
        try {  
            var message = await GasAPI.addNewGas(gasData);
            if(message.status == 201){
                return message.responseText;
            }else{
                return null;
            }
        } catch (error) {
            alert(error.responseText)
        }

    }
} 