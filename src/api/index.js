const {Router} = require('express')
const gamesRouter= require("./game/game.controller")
const router = new Router(); //routing agregujący inne routingi
const userRouter = require("./user/user.controller")
const genreRouter = require("./genre/genre.controller")
const producerRouter = require("./producer/producer.controller")
const ratingRouter = require("./rating/rating.controller")


router.use('/game', gamesRouter)
router.use('/user', userRouter)
router.use('/genre', genreRouter)
router.use('/producer', producerRouter)
router.use('/rating', ratingRouter)


module.exports = router;