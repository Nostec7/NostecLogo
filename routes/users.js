/**
 * Created by pauliuslegeckas on 02/03/2017.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/user', function(req, res, next) { //route to localhost:8000/users
    res.send('respond with a resource');
});

router.get('/detail', function(req, res, next) { //route to localhost:8000/users/detail
    res.send('respond with a detail');
});

module.exports = router;
