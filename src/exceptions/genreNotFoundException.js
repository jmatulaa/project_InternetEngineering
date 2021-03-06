class GenreNotFoundException extends Error {
    constructor(message) {
        super(message || "Genre not found");
        this.status = 404
    }
}

module.exports = GenreNotFoundException;