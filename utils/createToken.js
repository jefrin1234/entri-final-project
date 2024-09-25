const  jwt = require("jsonwebtoken");

const createSellerToken = (id, roles) => {
    try {
        const  token = jwt.sign({ id: id, roles: roles || ["user"] }, process.env.JWT_SECRET_KEY);
        return token;
    } catch (error) {
       next(error)
    }
};




 

const createUserToken = (id, roles) => {
    try {
        const  token = jwt.sign({ id: id, roles: roles || ["user"] }, process.env.JWT_SECRET_KEY);
        return token;
    } catch (error) {
       next(error)
    }
};

const createAdminToken = (id, roles) => {
    try {
        const  token = jwt.sign({ id: id, roles: roles || ["user"] }, process.env.JWT_SECRET_KEY);
        return token;
    } catch (error) {
       next(error)
    }
};

module.exports = {createAdminToken, createSellerToken,createUserToken };