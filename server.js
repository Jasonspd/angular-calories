var express         = require('express');
var app             = express();
var mongoose        = require('mongoose');
var morgan          = require('morgan');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var keys            = require('./config.js');

mongoose.connect(keys.db);

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());


// Mongoose model
var Food = mongoose.model('food', {
    text : String
});


// Routes
app.get('/api/foods', function(req, res) {
    Food.find(function(err, foods) {

        if (err)
            res.send(err)

        res.json(foods);
    });
});

app.post('/api/foods', function(req, res) {

    Food.create({
        text : req.body.text,
        done : false
    }, function(err, food) {
        if (err)
            res.send(err);

        Food.find(function(err, foods) {

            if (err)
                res.send(err)

            res.json(foods);
        });
    });
});

app.delete('/api/foods/:food_id', function(req, res) {
    Food.remove({
        _id : req.params.food_id
    }, function(err, todo) {
        if (err)
            res.send(err);

        Food.find(function(err, foods) {
            if (err)
                res.send(err)
            res.json(foods);
        });
    });
});

app.get('*', function(req, res) {
    res.sendFile('/index.html');
})


app.listen(process.env.PORT || 8080);
console.log('App running on port 8080');