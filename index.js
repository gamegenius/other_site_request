const http = require("http");
const url = require('url');
const querystring = require('querystring');
http.createServer(function (request, response) {
    response.writeHead(200, { "Content-Type": "text/javascript" });
    let receive_url = url.parse(request.url);
    let receive_query = querystring.parse(querystring.unescape(receive_url.query));
    let option = JSON.parse(receive_query.option);
    let output_JSON = "";
    let req = http.request(option, function (res) {
        let data = { responseHTML: "" }
        res.on('data', (chunk) => {
            data.responseHTML += chunk;
        });
        res.on('end', () => {
            output_JSON = JSON.stringify(data);
            response.write("other_site_request(" + output_JSON + ");");
            response.end();
        });
    });
    req.on('error',(e)=>{
        console.log('problem with request: ' + e.message);
    });
    req.end();
}).listen(5000);
