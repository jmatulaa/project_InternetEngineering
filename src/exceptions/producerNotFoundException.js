class ProducerNotFoundException extends Error {
    constructor(message) {
        super(message || "Producer not found");
        this.status = 404
    }
}

module.exports = ProducerNotFoundException;