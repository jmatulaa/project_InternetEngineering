class UserNotFoundException extends Error {
    constructor(message) {
        super(message || "User not found");
        this.status = 404
    }
}

module.exports = UserNotFoundException;