

ReqCurlEnd=function(req, res){  this.req=req; this.res=res;  this.Str=[]; }
ReqCurlEnd.prototype.mes=function(str){ this.Str.push(str); }
ReqCurlEnd.prototype.mesO=function(str){
  if(str) this.Str.push(str);
  var str=this.Str.join('\n');  this.res.end(JSON.stringify(str));
}

ReqCurlEnd.prototype.go=function(){
  var req=this.req, res=this.res, objQS=req.objQS, uDomain=req.uDomain;
  var mes=this.mes, mesO=this.mesO;
  res.setHeader("Content-type", "application/json");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");

    // Google Chrome makes a "preflight" on cross site ajax-request, where the origin must be approved
  var strOfficialControlSite="https://control.gavott.com";
  var strOfficialControlSite="https://emagnusandersson.github.io";
  var boDbg=true; // Change to false in production
  var http_origin = uDomain; 
  if('origin' in req.headers){ //if cross site
    http_origin=req.headers.origin;
    var boAllowDbg=boDbg && RegExp("^http\:\/\/(localhost|192\.168\.)").test(http_origin);
    if(boAllowDbg || http_origin == strOfficialControlSite  ){
        res.setHeader("Access-Control-Allow-Origin", http_origin);
    }
    if(req.method=='OPTIONS'){   return;} // Maybe one could assume that this is allways true.
  }


  var pubKey; if("pubKey" in objQS) { pubKey=objQS.pubKey; }  else{ this.mesO('No public key "pubKey" in the query line'); return;}
  var sixSignature; if("signature" in objQS) { sixSignature=objQS.signature; }  else{ this.mesO('No "signature" in the query line');  return;} // Using the prefix "six" for base64-encoded data
  var data; if("data" in objQS) { data=objQS.data; }  else{ this.mesO('No "data" in the query line'); return;}

  //var pemPub=pubKey, sixPub=pubKey.split('\n').slice(1,-2).join('\n');    // <--I removed the "-----XXXX-----" lines. This line should be usesd if these lines where still in place.
  var pemPub="-----BEGIN PUBLIC KEY-----\n"+pubKey+"-----END PUBLIC KEY-----", sixPub=pubKey;
  var keyV = new NodeRSA(pemPub);
  var boOK=keyV.verify(data, sixSignature, 'utf8', 'base64');
  var boOK; if(!boOK){ this.mesO('Message does NOT authenticate'); return;}
  this.mesO('boVerifies: '+boOK); 

  
}



