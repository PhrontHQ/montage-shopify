/** If you want to use the local development environment with the dev backend,
 * this will create a proxy so you won't run into CORS issues.
 * It accepts the following command line parameters:
 * - port the port where the proxy will listen
 * - target the DEV backend target to contact.
 * Example: If you set the port to 3000 and target to https://dev.nibo.ai then
 * your actual "resourceBaseUrl" in NiboSettings should be http://localhost:3000/api/v1
 */
 // Define the command line options
const optionDefinitions = [
	{ name: "port", alias: "p", type: Number, defaultValue: 6789 },
	{ name: "target", alias: "t", type: String, defaultValue: "https://etiama.myshopify.com" }
];
commandLineArgs = require("command-line-args");
// parse command line options
const options = commandLineArgs(optionDefinitions);

// Start the proxy
console.log("Start proxy on port", options.port, "for", options.target);
var http = require("http"), httpProxy = require("http-proxy");

// Create a proxy server with custom application logic
var proxy = httpProxy.createProxyServer({
    target: "https://etiama.myshopify.com",
    headers: {
        //"Content-Type": "application/json",
        "X-Shopify-Access-Token": "d4d9799d167b2ab209f7f0952abd8c6f",
        'X-GraphQL-Cost-Include-Fields': "true"
        },
    secure: true});
var sendError = function(res, err) {
	return res.status(500).send({
		 error: err,
		 message: "An error occured in the proxy"
	});
};

// error handling
proxy.on("error", function (err, req, res) {
	sendError(res, err);
});

var enableCors = function(req, res) {
	if (req.headers['access-control-request-method']) {
		res.setHeader('access-control-allow-methods', req.headers['access-control-request-method']);
	}

	if (req.headers['access-control-request-headers']) {
		res.setHeader('access-control-allow-headers', req.headers['access-control-request-headers']);
	}

	if (req.headers.origin) {
		res.setHeader('access-control-allow-origin', req.headers.origin);
		res.setHeader('access-control-allow-credentials', 'true');
	}
};

proxy.on('proxyReq', function(proxyReq, req, res, options) {
	console.log(proxyReq.url, JSON.stringify(proxyReq.headers, true, 2));

  });
  
// set header for CORS
proxy.on("proxyRes", function(proxyRes, req, res) {
	enableCors(req, res);
});

logger = function() {    
	// This will only run once
	//svar logFile = fs.createWriteStream('./requests.log');
  
	return function (request, response, next) { 
	  // This will run on each request.
	  //logFile.write(JSON.stringify(request.headers, true, 2));
	  next();
	}
  }
  
var server = http.createServer(function(req, res) {


	// You can define here your custom logic to handle the request
	// and then proxy the request.
	if (req.method === 'OPTIONS') {
		enableCors(req, res);
		res.writeHead(200);
		res.end();
		return;
	}

	proxy.web(req, res, {
		target: options.target,
		secure: true,
		changeOrigin: true
	}, function(err) {
		sendError(res, err);
	});
});

server.listen(options.port);
