class GameNotFoundException extends Error {
    constructor(message) {
        super(message || "Game not found in library");
        this.status = 404
    }
}

module.exports = GameNotFoundException;