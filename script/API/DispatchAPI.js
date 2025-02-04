export const DispatchAPI = {
    authToken : localStorage.getItem("authToken"),
    addNewDispatch : async function(dispatchData){

        return await $.ajax({
            url: "http://localhost:8080/api/dispatch/create",
            type : 'POST',
            contentType: "application/json",
            headers : {'Authorization' : `Bearer ${this.authToken}`},
            data: JSON.stringify(dispatchData)
        })
    },

    getAll : async function(){
        return await $.ajax({
            url: "http://localhost:8080/api/dispatch/getAll",
            type : 'GET',
            headers : {'Authorization' : `Bearer ${this.authToken}`},
        })
    },

    dispatchOrder : async function(dispatchID) {
        return await $.ajax({
            url: `http://localhost:8080/api/dispatch/order/${dispatchID}`,
            type : 'POST',
            headers : {'Authorization' : `Bearer ${this.authToken}`},
        })
    }
}