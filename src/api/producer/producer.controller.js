const {Router} = require('express')
const Producer = require('../../models/producer.model')
const asyncHandler = require("../asyncHandler");
const errorHandler = require("../../middleware/errorHandler");
const ProducerNotFoundException = require("../../exceptions/producerNotFoundException");

const router = new Router();

router.get('/', asyncHandler( async(req,res) =>{
    const producers = await Producer.query();
    res.send(producers);
}))

router.get('/:id', asyncHandler(async(req, res)=>{
    const id = req.params.id;
    const producer = await Producer.query().findById(id);
    if (!producer) throw new ProducerNotFoundException();
    res.send(producer);
}))

//dodanie nowego producenta
router.post('/', asyncHandler (async(req, res)=>{
    const producer = await Producer.query().insert({
        name: req.body.name
    })
    res.status(201).send(producer);
}))

//aktualizacja danych
router.put('/:id', asyncHandler (async(req, res)=>{
    const id = req.params.id;
    const updateProducer = await Producer.query().patchAndFetchById(id, req.body)
    if (!updateProducer) throw new ProducerNotFoundException();
    res.send(updateProducer);
}))

//usuwanie tez trzeba zrobic kaskadowe czyli takie jak jest dla gry oraz gatunktu
router.delete('/:id', asyncHandler (async(req, res)=>{
    const {id} = req.params;
    const deletedCount = await Producer.query().deleteById(id);
    if(deletedCount == 0) throw new ProducerNotFoundException();
    res.status(205).end();
}))

//DELETE /api/producers/id
router.delete('/:id', asyncHandler (async(req, res)=>{
    const {id} = req.params;
    const producer = await Producer.query().findById(id);
    if(!producer) throw new ProducerNotFoundException();

    const transaction = await Producer.startTransaction();
    try{
        await Producer.query(transaction).deleteById(id);
        await transaction.commit();
    } catch (err) {
        await transaction.rollback()
        throw err;
    }
    res.status(205).end();
}))

module.exports = router;