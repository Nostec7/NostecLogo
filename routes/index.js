/**
 * Created by pauliuslegeckas on 02/03/2017.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {  //localhost:8000
    //res.writeHead(200, {'Content-Type': 'text/html'});
    //res.render('index', { title: 'Kursinis darbas: Comenius logo', condition: true, anyArray: [1,2,3] }); // main pavadinimas
    res.render('index', { title: 'Kursinis darbas: Comenius logo'}); // main pavadinimas
});


/*router.get('/kursinis', function(req, res, next) { //localhost:8000/kursinis
    //res.writeHead(200, {'Content-Type': 'text/html'});
    res.render('index', { title: 'Kursinis' });
});*/

router.get('/client', function(req, res, next) { // tikisi get id
    res.render('index', { });
});

router.get('/', function (req, res, next){
    res.sendFile(_dirname + '/views/index.hbs');
})

router.post('/test/run', function(req, res, next){ //gauna is index.hbs
    var id = req.body.id;
});



module.exports = router;
