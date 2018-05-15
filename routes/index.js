/**
 * Created by pauliuslegeckas on 02/03/2017.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Nostec Logo'});
});
/*
router.get('/login', function(req, res, next) {
    res.render('login', { });
});

router.get('/register', function(req, res, next) { // tikisi get id
    res.render('register', { });
});

router.get('/editor', function(req, res, next) { // tikisi get id
    res.render('index', { });
});

router.get('/', function (req, res, next){
    res.sendFile(_dirname + '/views/index.hbs');
})

router.post('/test/run', function(req, res, next){ //gauna is index.hbs
    var id = req.body.id;
});*/

module.exports = router;
