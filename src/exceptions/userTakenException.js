class UserTakenException extends Error {
    constructor(message) {
        super(message + " is taken");
        this.status = 409
    }
}

module.exports = UserTakenException;