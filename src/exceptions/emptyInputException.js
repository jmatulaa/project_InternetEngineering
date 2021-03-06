class EmptyInputException extends Error {
    constructor(message) {
        super(message + " cannot be empty" || "Input data cannot be empty");
        this.status = 400
    }
}

module.exports = EmptyInputException;