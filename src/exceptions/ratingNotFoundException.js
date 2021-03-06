class RatingNotFoundException extends Error {
    constructor(message) {
        super(message || "Rating not found");
        this.status = 404
    }
}

module.exports = RatingNotFoundException;