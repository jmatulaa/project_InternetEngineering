const {Router} = require('express');
const Rating = require('../../models/rating.model');
const asyncHandler = require("../asyncHandler");
const errorHandler = require("../../middleware/errorHandler");
const RatingNotFoundException = require("../../exceptions/ratingNotFoundException");
const IncorrectInputException = require("../../exceptions/incorrectInputException");
const Game = require('../../models/game.model')

const router = new Router();

function checkGameParams(gameName, price, ageRange, languageVersion, mode) {
    if (gameName === "") throw new IncorrectInputException("Game name cannot be empty");
    if (price < 0) throw new IncorrectInputException("Price cannot be a negative number");
    if (ageRange < 0) throw new IncorrectInputException("Age range cannot be a negative number");
    if (languageVersion === "") throw new IncorrectInputException("Language version cannot be empty");
    if (mode !== "singleplayer" || mode !== "multiplayer") throw new IncorrectInputException("Game mode can only be single- or multi- player");
}

//GET api/rating
router.get('/', asyncHandler( async(req,res) =>{
    const rating = await Rating.query();
    res.send(rating);
}))

//GET api/rating/id
//wyszukanie oceny po id
router.get('/:id', asyncHandler(async(req, res)=>{
    const id = req.params.id;
    const rating = await Rating.query().findById(id);
    if (!rating) throw new RatingNotFoundException();
    res.send(rating);
}))

//dodajemy ocene do istniejącej gry
router.post('/', asyncHandler (async(req, res)=>{

    const {ratings, opinion, gameId} = req.body;

    if (ratings > 5 || ratings < 0) throw new IncorrectInputException("Invalid rate - rate should be between 0 and 5");

    const game = await Game.query().findById(gameId);
    if(!game) throw new GameNotFoundException();

    const rating = await Rating.query().insertGraphAndFetch({
        rating: ratings,
        opinion: opinion,
        ratingGame: [{
            '#dbRef': gameId
        }]
    });

    res.status(201).send(rating);
}))

//dodanie oceny wraz z grą
router.post('/gameNew', asyncHandler (async(req, res)=>{

    const {ratings, opinion, gameName, price, ageRange, languageVersion, mode} = req.body;

    if (ratings > 5 || ratings < 0) throw new IncorrectInputException("Invalid rate - rate should be between 0 and 5");

    checkGameParams(gameName, price, ageRange, languageVersion, mode);

    const rating = await Rating.query().insertGraphAndFetch({
        rating: ratings,
        opinion: opinion,
        ratingGame: [{
            name: gameName,
            price: price,
            ageRange: ageRange,
            languageVersion: languageVersion,
            mode: mode
        }]
    });

    res.status(201).send(rating);
}))

//możliwość modyfikacji danych w tabeli
router.put('/:id', asyncHandler (async(req, res)=>{
    const id = req.params.id;
    const updatedRating = await Rating.query().patchAndFetchById(id, req.body)
    if (!updatedRating) throw new RatingNotFoundException();
    res.send(updatedRating);
}))

//usunięcie wiersza w tabeli
router.delete('/:id', asyncHandler (async(req, res)=>{
    const {id} = req.params;
    const rating = await Rating.query().findById(id);
    if(!rating) throw new RatingNotFoundException();

    const transaction = await Rating.startTransaction();
    try{
        await Rating.query(transaction).deleteById(id);
        await transaction.commit();
    } catch (err) {
        await transaction.rollback()
        throw err;
    }
    res.status(205).end();
}))




module.exports=router;