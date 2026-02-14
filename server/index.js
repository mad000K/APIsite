const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs');
const dataPath = path.join(__dirname, 'data');

const server = http.createServer((req, res)=> {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*');
        if(req.url == '/jokes' && req.method == 'GET') {
            return getAllJokes(req, res);
        }
        if(req.url == '/jokes' && req.method == 'POST') {
            return addJoke(req, res);
        }
        if(req.url.startsWith('/like')) {
            return like(req, res);
        }
        if(req.url.startsWith('/dislike')) {
            return dislike(req, res);
        }
        res.statusCode = 404;
        return res.end('Error 404');
    }
    catch(e) {
        res.statusCode = 500;
        return res.end('Error 500');
    }
});
server.listen(3000);

function getAllJokes(req, res) {
    let dir = fs.readdirSync(dataPath);
    let allJokes = [];
    for(let i = 0; i < dir.length; i++) {
        let file = fs.readFileSync(path.join(dataPath, i+'.json'));
        let jokeJson = Buffer.from(file).toString();
        let joke = JSON.parse(jokeJson);
        joke.id = i;

        allJokes.push(joke);
    }
    return res.end(JSON.stringify(allJokes));
}

function addJoke(req, res) {
    let data = '';
    req.on('data', function(chunk) {
        data += chunk;
    });
    req.on('end', function() {
        let joke = JSON.parse(data);
        joke.likes = 0;
        joke.dislikes = 0;

        let dir = fs.readdirSync(dataPath);
        let fileName = dir.length+'.json';
        let filePath = path.join(dataPath, fileName);

        
        fs.writeFileSync(filePath, JSON.stringify(joke));
        res.statusCode = '201';
        return res.end(JSON.stringify(joke));
    });
}

function like(req, res) {
    const url = require('url');
    const params = url.parse(req.url, true).query;
    let id = params.id;
    if(id) {
        let filePath = path.join(dataPath, id+'.json') 
        let file = fs.readFileSync(filePath);
        let jokeJSON = Buffer.from(file).toString();
        let joke = JSON.parse(jokeJSON);
    
        joke.likes++;
    
        fs.writeFileSync(filePath, JSON.stringify(joke));

        joke.id = id;

        return res.end(JSON.stringify(joke));
    }
    res.statusCode = '400';
    return res.end('Bad request');
}

function dislike(req, res) {
    const params = url.parse(req.url, true).query;
    let id = params.id;
    if(id){
        let filePath = path.join(dataPath, id+'.json')
        let file = fs.readFileSync(filePath);
        let jokeJSON = Buffer.from(file).toString();
        let joke = JSON.parse(jokeJSON);
    
        joke.dislikes++;
    
        fs.writeFileSync(filePath, JSON.stringify(joke));

        joke.id = id;

        return res.end(JSON.stringify(joke));
    }
    res.statusCode = '400';
    return res.end('Bad request');
}