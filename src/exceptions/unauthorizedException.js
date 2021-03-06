class UnauthorizedException extends Error {
    constructor(message) {
        super(message || "Unauthorized access");
        this.status = 401
    }
}

module.exports = UnauthorizedException;