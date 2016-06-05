var express         = require('express');
var app             = express();
var mongoose        = require('mongoose');
var morgan          = require('morgan');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var config          = require('./config.js');
var date            = new Date;
var fatSecretUrl    = "http://platform.fatsecret.com/rest/server.api"
var crypto          = require("crypto");
var request         = require("request");

mongoose.connect(config.db);

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());


// Mongoose model
var Food = mongoose.model('food', {
    text : String,
    calories: Number
});

//Fat secret

// var reqObj = {
//     method: "foods.search",
//     oauth_consumer_key: config.key,
//     oauth_nonce: "abc",
//     oauth_signature_method: "HMAC-SHA1",
//     oauth_timestamp: Math.floor(date.getTime()/1000),
//     oauth_version: "1.0",
//     search_expression: "banana"
// }

// var paramsStr = '';
// for (var i in reqObj) {
//   paramsStr += "&" + i + "=" + reqObj[i];
// }

// paramsStr = paramsStr.substr(1);

// var sigBaseStr = "POST&"
//                  + encodeURIComponent(fatSecretUrl)
//                  + "&"
//                  + encodeURIComponent(paramsStr);

// config.secret += "&";

// console.log(sigBaseStr);

// var hashedBaseStr  = crypto.createHmac('sha1', config.secret).update(sigBaseStr).digest('base64');

// // Add oauth_signature to the request object
// reqObj.oauth_signature = hashedBaseStr;
// console.log(reqObj);


// Routes
app.post("/fatsecret/api", function(req, res) {

    var reqObj = {
        method: "foods.search",
        oauth_consumer_key: config.key,
        oauth_nonce: Math.random().toString(36).replace(/[^a-z]/, '').substr(2),
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: Math.floor(date.getTime()/1000),
        oauth_version: "1.0",
        search_expression: "apples"
    }

    var paramsStr = '';
    for (var i in reqObj) {
      paramsStr += "&" + i + "=" + reqObj[i];
    }

    paramsStr = paramsStr.substr(1);

    var sigBaseStr = "POST&"
                 + encodeURIComponent(fatSecretUrl)
                 + "&"
                 + encodeURIComponent(paramsStr);

    var hashedBaseStr  = crypto.createHmac('sha1', config.secret).update(sigBaseStr).digest('base64');
    console.log(hashedBaseStr);

    reqObj.oauth_signature = hashedBaseStr;

    // var finalUrl = sigBaseStr + "&" + "oauth_signature=" + hashedBaseStr;
    var finalUrl = fatSecretUrl + "?" + paramsStr + "&oauth_signature=" + reqObj.oauth_signature;
    // var finalUrl = "http://platform.fatsecret.com/rest/server.api?method=foods.search&search_expression=banana&oauth_consumer_key=987d96ca6f7643658a502f8583ade1e7&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1465085779&oauth_nonce=0l0SxC&oauth_version=1.0&oauth_signature=mPtstGjAGggcQ+khKQYrq2yweYk=";

    //http://platform.fatsecret.com/rest/server.api?method=foods.search&search_expression=banana&oauth_consumer_key=987d96ca6f7643658a502f8583ade1e7&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1465082317&oauth_nonce=93Lz84&oauth_version=1.0&oauth_signature=IV5kWdKN9nbCMc5e7KNrlhBB4zs=

    request(finalUrl, function (error, response, body) {
        console.log(body);
    });

});


app.get('/api/foods', function(req, res) {
    Food.find(function(err, foods) {
        console.log(foods);

        function total() {
            var totalNumber = 0
            for(var i=0; i<foods.length; i++) {
                totalNumber = totalNumber + foods[i].calories;
                console.log(foods[i].calories);
            };
            return totalNumber;
        }
        if (err)
            res.send(err)

        var data = {"foods": foods, "total": total()};

        res.json(data);
    });
});

app.post('/api/foods', function(req, res) {
    console.log(req.body);

    Food.create({
        text : req.body.text,
        calories : req.body.calories,
        done : false
    }, function(err, food) {
        if (err)
            res.send(err);

        Food.find(function(err, foods) {

            if (err)
                res.send(err)

            var data = {"foods": foods, "newCalories": req.body.calories};

            res.json(data);
        });
    });
});

app.delete('/api/foods/:food_id', function(req, res) {

    Food.findOne({"_id": req.params.food_id}, function(err, foods) {
        var deletedCalories =foods.calories;

        Food.remove({
            _id : req.params.food_id
        }, function(err, todo) {
            if (err)
                res.send(err);

            Food.find(function(err, foods) {
                if (err)
                    res.send(err)

                var data = {"foods": foods, "deletedCalories": deletedCalories};

                res.json(data);
            });
        });

    });
});

app.get('*', function(req, res) {
    res.sendFile('/index.html');
})


app.listen(process.env.PORT || 8080);
console.log('App running on port 8080');