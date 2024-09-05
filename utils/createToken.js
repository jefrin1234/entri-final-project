const  jwt = require("jsonwebtoken");

const createToken = (id, roles) => {
    try {
        const  token = jwt.sign({ id: id, roles: roles || ["user"] }, process.env.JWT_SECRET_KEY);
        return token;
    } catch (error) {
        console.log(error);
    }
};

module.exports = { createToken };