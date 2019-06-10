const http = require("http");
const https = require("https");
const url = require('url');
const querystring = require('querystring');
const PORT = process.env.PORT || 3000;
http.createServer(function (request, response) {
    response.writeHead(200, { "Content-Type": "text/javascript" });
    if (request.url == "/") {
        response.write("Nothing.");
        response.end();
    } else {
        let receive_url = url.parse(querystring.unescape(request.url));
        let query = querystring.parse(receive_url.query);
        let run_function = "" + query.run_function;
        let option = "" + JSON.parse(query.option);
        let output_JSON = "";
        let req;
        switch (option.protocol) {
            case 'http:':
                req = http.request(option, function (res) {
                    let data = { url: option.protocol + "//" + option.hostname + option.path, header: res.rawHeaders, responseHTML: "" };
                    res.on('data', (chunk) => {
                        data.responseHTML += chunk;
                    });
                    res.on('end', () => {
                        output_JSON = JSON.stringify(data);
                        response.write(run_function + "(" + output_JSON + ");");
                        response.end();
                    });
                });
                req.on('error', (e) => {
                    console.log('problem with request: ' + e.message);
                });
                req.end();
                break;
            case 'https:':
                req = https.request(option, function (res) {
                    let data = { url: option.protocol + "//" + option.hostname + option.path, header: res.rawHeaders, responseHTML: "" };
                    res.on('data', (chunk) => {
                        data.responseHTML += chunk;
                    });
                    res.on('end', () => {
                        output_JSON = JSON.stringify(data);
                        response.write(run_function + "(" + output_JSON + ");");
                        response.end();
                    });
                });
                req.on('error', (e) => {
                    console.log('problem with request: ' + e.message);
                });
                req.end();
                break;
        }
        response.on('error', (e) => {
            response.write(e);
            response.end();
        });
    }
}).listen(PORT,function () {
  console.log('Example app listening on port 3000!');
});
