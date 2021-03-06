const {Router} = require('express');
const User = require('../../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require("../../../config");
const asyncHandler = require("../asyncHandler");
const UserNotFoundException = require("../../exceptions/userNotFoundException");
const UserTakenException = require("../../exceptions/userTakenException");
const EmptyInputException = require("../../exceptions/emptyInputException");
const IncorrectInputException = require("../../exceptions/incorrectInputException");
const GameNotFoundException = require("../../exceptions/gameNotFoundException");
const Game = require("../../models/game.model")
const auth = require("../../middleware/authentication");

const router = new Router();

router.post('/register', asyncHandler (async(req, res) => {
    const username = req.body.username;
    if (username === "") throw new EmptyInputException("Username");
    const email = req.body.email;
    if (email === "") throw new EmptyInputException("Email");
    if (req.body.password.length < 8) throw new IncorrectInputException("Password has to be at least 8 characters long");
    const password = bcrypt.hashSync(req.body.password);

    let user;

    let user1 = await User.query().select("email").where("email", "like", "" + req.body.email + "");
    let user2 = await User.query().select("email").where("username", "like", "" + req.body.username + "");
    if (user1[0]) {
        throw new UserTakenException("Email");
    } else if(user2[0]) {
        throw new UserTakenException("User");
    } else {
        user = await User.query().insert({
            username: username,
            email: email,
            password: password,
            bonusPoints: 0
        });

        if (user) {
            const expiresIn = 60*10;
            const accessToken = jwt.sign({ id: user.id }, config.jwtSecretKey, {
                expiresIn: expiresIn
            });
            res.status(200).send({ "status": "Register successful", "username": user.username, "email" : user.email, "access token": accessToken, "expires in ": expiresIn + " seconds" });
        }
    }

}));

router.post('/login', asyncHandler (async(req, res) => {
    const email = req.body.email;
    if (email === "") throw new EmptyInputException("Email");
    const password = req.body.password;
    const user1 = await User.query().select("id", "password", "username").where("email", "like", "" + email + "");

    if (!user1[0]) {

        throw new UserNotFoundException;
    } else {
        const result = bcrypt.compareSync(password, user1[0].password);
        if (!result) throw new IncorrectInputException("Password is not valid");

        const expiresIn = 60*10;
        const accessToken = jwt.sign({ id: user1[0].id }, config.jwtSecretKey, {
            expiresIn: expiresIn
        });
        res.status(200).send({ "status": "Login successful", "user": user1[0].username, "access token": accessToken, "expires in ": expiresIn + " seconds" });
    }

}));

router.get('/me', auth, asyncHandler(async (req, res) => {
    let user = User.query().
        select("User.username", "User.email", "User.bonusPoints").
        withGraphJoined("userGame").
        modifyGraph("userGame", builder => builder.select("Game.name", "Game.price", "Game.ageRange", "Game.languageVersion", "Game.mode"));
    user = user.where('User.id', 'like', req.user.myId);
    res.send(await user);
}));

router.post('/gamePurchase', auth, asyncHandler(async (req, res) => {

    const {gameName} = req.body;

    let game = await Game.query().select("Game.id").where("Game.name", "like", "" + gameName + "");
    let userPoints = await User.query().select("User.bonusPoints").where('User.id', 'like', req.user.myId);

    if (!game[0]) throw new GameNotFoundException();

    const user1 = await User.query().select("User.id").withGraphJoined("userGame").modifyGraph("userGame", builder => builder.select("Game.id").where("Game.id", "like", game[0].id))
        .where('User.id', 'like', req.user.myId);

    if (user1[0].userGame[0]) {
        if(user1[0].userGame[0].id === game[0].id) throw new IncorrectInputException("User already has this game in library");
    }

    const user = await User.query().upsertGraphAndFetch({
        id: req.user.myId,
        userGame: [{
            '#dbRef': game[0].id
        }],
        bonusPoints: userPoints[0].bonusPoints + 1
    }, {noDelete: true});

    res.send({ "status": "Purchase successful", "username": user.username, "email" : user.email, "game": user.userGame});
}));

router.put('/updateMe', auth, asyncHandler (async(req, res)=>{
    const id = req.user.myId;
    if (req.body.email) {
        const email = req.body.email;
        if (email === "") throw new EmptyInputException("Email");

        let user1 = await User.query().select("email").where("email", "like", "" + req.body.email + "");
        if (user1[0]) {
            throw new UserTakenException("Email");
        }
    } else if(req.body.username) {
        const username = req.body.username;
        if (username === "") throw new EmptyInputException("Username");

        let user1 = await User.query().select("username").where("username", "like", "" + req.body.username + "");
        if (user1[0]) {
            throw new UserTakenException("Username");
        }
    }


    const updateUser = await User.query().patchAndFetchById(id, req.body)
    if (!updateUser) throw new UserNotFoundException();
    res.send(updateUser);
}))

module.exports = router;