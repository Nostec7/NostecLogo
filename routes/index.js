/**
 * Created by pauliuslegeckas on 02/03/2017.
 */
var express = require('express');
var router = express.Router();
router.use(express.static(__dirname + '/views'));
router.use(express.static(__dirname + '/javascripts'));

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Nostec Logo'});
    appendTask();
});


const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: true}));
router.post('/register-student/', (req, res) => {
    res.json("Register response success");   // send the response in the form of json

    const postBody = req.body;
    var userDataToWrite = postBody.username + " " + postBody.password;
    console.log(userDataToWrite);
    appendNewStudent(userDataToWrite);
});
router.post('/register-teacher/', (req, res) => {
    res.json("Register response success");   // send the response in the form of json

    const postBody = req.body;
    var userDataToWrite = postBody.username + " " + postBody.password;
    console.log(userDataToWrite);
    appendNewTeacher(userDataToWrite);
});

function appendTask() {
    const fs = require('fs');
    fs.appendFile('message.txt', 'data to append\n', function (err) {
        if (err) throw err;
        console.log('New user saved!');
    });
}

function appendNewStudent(userData){
    const fs = require('fs');
    fs.appendFile('./public/javascripts/data/users/users-student.txt', '\n'+userData, function (err) {
        if (err) throw err;
        console.log('New user saved!');
    });
}
function appendNewTeacher(userData){
    const fs = require('fs');
    fs.appendFile('./public/javascripts/data/users/users-teacher.txt', '\n'+userData, function (err) {
        if (err) throw err;
        console.log('New user saved!');
    });
}


router.post('/upload-task/', (req, res) => {
    res.json("Upload response success");   // send the response in the form of json
    const postBody = req.body;
    var taskData = postBody.taskname + " " + postBody.description + '\n';
    createTaskFile(postBody.taskname, postBody.description);
});

router.post('/upload-task-images/', (req, res) => {
    res.json("Upload images response success");   // send the response in the form of json
    const postBody = req.body;
    appendTaskFile(postBody.taskname, postBody.imagedata);
});

function createTaskFile(taskName, taskDescription){
    const fs = require('fs');
    var dataToWrite = taskName + '\n' + taskDescription;
    fs.writeFile('./public/javascripts/data/tasks/' + taskName + '.txt', dataToWrite, function (err) {
        if (err) throw err;
        console.log('New task saved!');
    });
}

function appendTaskFile(taskName, imageData){
    const fs = require('fs');
    var subsImgData;
    /*if(imageData.substr(0,4) == "data"){
        subsImgData = imageData.substr(15);
    } else{
        subsImgData = imageData;
    }*/

    fs.appendFile('./public/javascripts/data/tasks/' + taskName + '.txt', "\n\n"+imageData, function (err) {
        if (err) throw err;
    });
}






module.exports = router;
