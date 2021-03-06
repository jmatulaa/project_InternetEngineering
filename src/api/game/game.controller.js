const {Router} = require('express')
const Game = require('../../models/game.model')
const Producer = require('../../models/producer.model')
const Genre = require('../../models/genre.model')
const asyncHandler = require("../asyncHandler");
const errorHandler = require("../../middleware/errorHandler");
const GameNotFoundException = require("../../exceptions/gameNotFoundException");
const ProducerNotFoundException = require("../../exceptions/producerNotFoundException")
const GenreNotFoundException = require("../../exceptions/genreNotFoundException")
const EmptyInputException = require("../../exceptions/emptyInputException");
const IncorrectInputException = require("../../exceptions/incorrectInputException")

const router = new Router();

function checkGameParams(gameName, price, ageRange, languageVersion, mode) {
    if (gameName === "") throw new EmptyInputException("Game name");
    if (price < 0) throw new IncorrectInputException("Price cannot be a negative number");
    if (ageRange < 0) throw new IncorrectInputException("Age range cannot be a negative number");
    if (languageVersion === "") throw new EmptyInputException("Language version");
    if  (mode !== "singleplayer") {
        if (mode !== "multiplayer") throw new IncorrectInputException("Game mode can only be single- or multi- player");
    }
}

router.get('/', asyncHandler( async(req,res) =>{
    let games = Game.
        query().
        select("Game.name", "price", "ageRange", "languageVersion", "mode").
        withGraphJoined("producer").
        withGraphJoined("genreGame").
        withGraphJoined("ratingGame").
        modifyGraph("producer", builder => builder.select("Producer.name")).
        modifyGraph("genreGame", builder => builder.select("Genre.name")).
        modifyGraph("ratingGame", builder => builder.select("Rating.rating", "Rating.opinion"));

        if(req.body.name) {
            games = games.where('Game.name', 'like', "%" + req.body.name + "%");
        }
        res.send(await games);
}))

router.get('/specifiedGenre', asyncHandler( async(req,res) =>{
    let games = Game.
    query().
    select("Game.name", "price", "ageRange", "languageVersion", "mode").
    withGraphJoined("producer").
    withGraphJoined("genreGame").
    modifyGraph("producer", builder => builder.select("Producer.name")).
    modifyGraph("genreGame", builder => builder.select("Genre.name")).where('genreGame.name', 'like', "%" + req.body.name + "%");
    res.send(await games);
}))

router.get('/:id', asyncHandler(async(req, res)=>{
    const id = req.params.id;
    const games = await Game.query().findById(id);
    if (!games) throw new GameNotFoundException();
    res.send(games);
}))

router.post('/brandNew', asyncHandler (async(req, res)=>{
    const {gameName, price, ageRange, languageVersion, mode, producerName, genreName} = req.body;

   checkGameParams(gameName, price, ageRange, languageVersion, mode);

    const game = await Game.query().insertGraphAndFetch({
        name: gameName,
        price: price,
        ageRange: ageRange,
        languageVersion: languageVersion,
        mode: mode,
        producer: {
            name: producerName
        },
        genreGame: [{
            name: genreName
        }]
    });

    res.status(201).send(game);
}))

router.post('/', asyncHandler (async(req, res)=>{

    const {gameName, price, ageRange, languageVersion, mode, producerId, genreId} = req.body;

    checkGameParams(gameName, price, ageRange, languageVersion, mode);

    const producer = await Producer.query().findById(producerId);
    if(!producer) throw new ProducerNotFoundException();

    const genre = await Genre.query().findById(genreId);
    if(!genre) throw new GenreNotFoundException();

    const game = await Game.query().insertGraphAndFetch({
        name: gameName,
        price: price,
        ageRange: ageRange,
        languageVersion: languageVersion,
        mode: mode,
        producer: {
            '#dbRef': producerId
        },
        genreGame: [{
            '#dbRef': genreId
        }]
    });

    res.status(201).send(game);
}))


router.post('/:id/genres', asyncHandler (async(req, res)=>{

    const id = req.params.id;

    const updatedGame = await Game.query().findById(id);
    if(!updatedGame) throw new GameNotFoundException();

    if(req.body.genre) {
        if(req.body.genre === "") throw new EmptyInputException();
        const modifiedGame = await Game.query().upsertGraphAndFetch({
            id,
            genreGame: [{
                name: req.body.genre
            }]
        }, {noDelete: true})
        res.status(201).send(modifiedGame);
    } else if(req.body.genreId) {
        const genre = await Genre.query().findById(req.body.genreId);
        if(!genre) throw new GenreNotFoundException();

        const modifiedGame = await Game.query().upsertGraphAndFetch({
            id,
            genreGame: [{
                '#dbRef': req.body.genreId
            }]
        }, {noDelete: true})
        res.status(201).send(modifiedGame);
    }

}))

//DELETE /api/game/1
router.delete('/:id', asyncHandler (async(req, res)=>{
    const {id} = req.params;
    const game = await Game.query().findById(id);
    if(!game) throw new GameNotFoundException();

    const transaction = await Game.startTransaction();
    try{
        await Game.query(transaction).deleteById(id);
        await transaction.commit();
    } catch (err) {
        await transaction.rollback()
        throw err;
    }
    res.status(205).end();
}))

module.exports = router;