http = require('http');
fs = require('fs');
server = http.createServer( function(req, res) {

    console.dir(req.param);

    if (req.method == 'POST') {
        console.log("POST");
        var body = '';
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
            const text = decodeURIComponent(body.replace('text=', '')).trim()
            const time = fs.readFileSync('d:/Program Files/Snaz/TextFiles/ChronoUp.txt', 'utf8');
            const q = `${time} ${text}\n`
            console.log(q)
            fs.appendFileSync('questions.txt', q);
        });
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('post received');
    }
    else
    {
        console.log("GET");
        //var html = '<html><body><form method="post" action="http://localhost:3000">Name: <input type="text" name="name" /><input type="submit" value="Submit" /></form></body>';
        var html = fs.readFileSync('index.html');
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(html);
    }

});

port = 8001;
host = '127.0.0.1';
server.listen(port, host);
console.log('Listening at http://' + host + ':' + port);