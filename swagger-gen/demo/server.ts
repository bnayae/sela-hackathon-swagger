import * as express from 'express';

var app = express();

app.get('/home', (req, res, next) => {
    res.send("Hello World");
});

app.get('/values:id', (req, res, next) => {
    res.send(`The Value is ${req.params.id}`);
});

app.listen(8080);
console.log('listening');
