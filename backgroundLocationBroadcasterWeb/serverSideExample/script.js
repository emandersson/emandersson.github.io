http = require("http");
url = require("url");
querystring = require('querystring');
NodeRSA = require('node-rsa');
//atob = require('atob');
//lib=require('./lib.js');
//libServer=require('./libServer.js');

require('./curlEnd.js');

port = Number(process.env.PORT || 5000);

handler=function(req, res){
  var domainName=req.headers.host;
  var objUrl=url.parse(req.url), uri=objUrl.pathname, qs=objUrl.query||'', objQS=querystring.parse(qs);
    
  var uDomain='http://'+domainName;
  req.uri=uri; req.qs=qs; req.objQS=objQS;  req.domainName=domainName; req.uDomain=uDomain;

  if("pubKey" in objQS && "data" in objQS) {      var reqCurlEnd=new ReqCurlEnd(req, res);      reqCurlEnd.go();    }
  else if("pubKey" in objQS){     res.end('Got pubKey='+objQS.pubKey);   }
  else{  res.end('Nothing done');      }
  

}
http.createServer(handler).listen(parseInt(port, 10));


console.log("Listening to port " + port);
