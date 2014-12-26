var http = require("http");
var url = require("url");

function start(route) {
  function onRequest(request, response) {
  //   if(request.method == 'POST') {
  //   } else {
    
  //   var pathname = url.parse(request.url).pathname;
  //   var queryString = url.parse(request.url).query;
  //   console.log("Request " + pathname + " received.");

  //   //route(pathname, queryString);

  //   response.writeHead(200, {"Content-Type": "text/plain"});
  //   response.write("Hello World");
  //   response.end();
  //   }
  // }
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello World");
    response.end(); 
    }

    http.createServer(onRequest).listen(5000);
    console.log("Server has started.");
  
}

exports.start = start;