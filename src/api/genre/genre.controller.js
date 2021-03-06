const {Router} = require('express')
const Genre = require('../../models/genre.model')
const asyncHandler = require("../asyncHandler");
const errorHandler = require("../../middleware/errorHandler");
const GenreNotFoundException = require("../../exceptions/gameNotFoundException");
const EmptyInputException = require("../../exceptions/emptyInputException");

const router = new Router();

//GET /api/genre
router.get('/', asyncHandler( async(req,res) =>{
    const genre = await Genre.query();
    res.send(genre);
}))

//GET /api/genre/1
router.get('/:id', asyncHandler(async(req, res)=>{
    const id = req.params.id;
    const genre = await Genre.query().findById(id);
    if (!genre) throw new GenreNotFoundException();
    res.send(genre);
}))

//POST /api/genre
router.post('/', asyncHandler (async(req, res)=>{
    if (req.body.name === "") throw new EmptyInputException();
    const genre = await Genre.query().insert({
        name: req.body.name,
    })
    res.status(201).send(genre);
}))

//PUT /api/genre/1
router.put('/:id', asyncHandler (async(req, res)=>{
    const id = req.params.id;
    const updatedGenre = await Genre.query().patchAndFetchById(id, req.body)
    if (!updatedGenre) throw new GenreNotFoundException();
    if(req.body.name === "") throw new EmptyInputException();
    res.send(updatedGenre);
}))

//DELETE /api/genre/1
router.delete('/:id', asyncHandler (async(req, res)=>{
    const {id} = req.params;
    const genre = await Genre.query().findById(id);
    if(!genre) throw new GenreNotFoundException();

    const transaction = await Genre.startTransaction();
    try{
        await Genre.query(transaction).deleteById(id);
        await transaction.commit();
    } catch (err) {
        await transaction.rollback()
        throw err;
    }
    res.status(205).end();
}))

module.exports = router;