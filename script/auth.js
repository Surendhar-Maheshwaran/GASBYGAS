export const auth = {
    // Check if the user is authenticated
    isAuthenticated: function () {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return false;
      }
  
      // Decode and verify token expiration
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode the JWT payload

      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      return payload.exp > currentTime; // Check if token is expired
    },
  
    // Get the user role from the token
    getUserRole: function () {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return null;
      }
  
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode the JWT payload
      var role =  (payload.userRole); // Assume 'role' is included in the JWT payload
      return role;
    },
  
    getUserID: function () {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return null;
      }
  
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode the JWT payload
      var userID =  (payload.userID); // Assume 'role' is included in the JWT payload
      return userID;
    },
    

    // Logout function to clear the token
    logout: function () {
      localStorage.removeItem("authToken");
      window.location.href = "/login.html";
    },
  };
  