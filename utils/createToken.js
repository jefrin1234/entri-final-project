const  jwt = require("jsonwebtoken");

const createSellerToken = (id, roles = ["seller"]) => {
    try {
      return jwt.sign({ id, roles }, process.env.JWT_SECRET_KEY);
    } catch (error) {
      console.error("Error creating token", error);
      throw new Error("Token creation failed");
    }
  };
  
 

const createUserToken = (id, roles) => {
    try {
        const  token = jwt.sign({ id: id, roles: roles || ["user"] }, process.env.JWT_SECRET_KEY);
        return token;
    } catch (error) {
      console.log(error)
      throw new Error("Token creation failed");
    }
};

const createAdminToken = (id, roles) => {
    try {
        const  token = jwt.sign({ id: id, roles: [roles] || ["admin"] }, process.env.JWT_SECRET_KEY);
        return token;
    } catch (error) {
      console.log(error)
      throw new Error("Token creation failed");
    }
};

module.exports = {createAdminToken, createSellerToken,createUserToken };