export const GasAPI = {
    authToken : localStorage.getItem("authToken"),
    url : "http://localhost:8080/api/gas",
    getAllGas : async function(){
        try{
            var listOfGas = await $.ajax({
                url: `http://localhost:8080/api/gas/getAll`,
                type: 'GET',
                headers :{
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            })
            return listOfGas;
        }catch(error){
            if (error.responseText) {
                throw new Error(error.responseText);
            } else {
                throw new Error("An unexpected error occurred.");
            }
        }
        
    },

    addNewGas : async function(gasData){
        try{
            var newGas = await $.ajax({
                url: `http://localhost:8080/api/gas/addNew`,
                type: 'POST',
                contentType : "application/json",
                headers :{
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
                data : JSON.stringify(gasData)
            })
            return {status : 201, responseText : newGas};
        }catch(error){
            if (error.responseText) {
                throw new Error(error.responseText);
            } else {
                throw new Error("An unexpected error occurred.");
            }
        }
    }
}