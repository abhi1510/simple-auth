var express = require("express")
var morgan = require("morgan")

hostname = "localhost";
port = 3000;

var app = express();

app.use(morgan('dev'));

//create our authentication middleware
function auth(req, res, next) {
    console.log(req.headers);

    var authHeader = req.headers.authorization;
    if(!authHeader) {
        var err = new Error("You are not authenticated!")
        err.status = 401; //authorization failed
        next(err);
        return;
    }
    // authHeader will be like "Basic QTD45HJHjhsdjhsjah=="
    var auth = new Buffer(authHeader.split(' ')[1], "base64").toString().split(':');
    var user = auth[0];
    var pass = auth[1];
    if(user === "admin" && pass === "password") {
        next();
    } else {
        var err = new Error("You are not authenticated!")
        err.status = 401; //authorization failed
        next(err);
    }
}

app.use(auth);

app.use(express.static(__dirname + '/public'));

app.use(function(err, req, res, next){
    res.writeHead(err.status || 500, {
        'WWW-Authenticate': 'Basic',
        'Content-Type': 'text/plain'
    });
    res.end(err.message);
})

app.listen(port, hostname, function(){
    console.log("Server running at http://"+hostname+":"+port)
})