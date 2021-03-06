const jwt = require('jsonwebtoken');
const UnauthorizedException = require("../exceptions/unauthorizedException");
const config = require("../../config");

module.exports = (req, res, next) => {
    let token = req.get("authorization")
    if (!token) throw new UnauthorizedException();

    let decodedToken;
    try {
        decodedToken = jwt.verify(token.slice(7), config.jwtSecretKey);
    } catch {
        throw new UnauthorizedException('Wrong token');
    }

    const user = {
        myId: decodedToken.id
    }

    req.user = user;
    next();

};