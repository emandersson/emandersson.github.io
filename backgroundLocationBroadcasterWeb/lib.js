"use strict"

//var app=(typeof window==='undefined')?global:window;
var app;  if(typeof window!=='undefined') app=window; else if(typeof global!=='undefined') app=global; else app=self;


//
// Object
//

app.copySome=function(a,b,Str){for(var i=0;i<Str.length;i++) { var name=Str[i]; a[name]=b[name]; } return a; }
app.copy=function(o, isdeep) {
    if (o===undefined || o===null || ['string', 'number', 'boolean'].indexOf(typeof o)!==-1)
        return o;
    var n= o instanceof Array? [] : {};
    for (var k in o)
        if (o.hasOwnProperty(k))
            n[k]= isdeep? copy(o[k], isdeep) : o[k];
    return n;
}

//
// Array
//

app.arrArrange=function(arrV,arrI){
  var n=arrI.length, arrNew;
  if(typeof arrV=='string') arrNew=" ".repeat(n); else arrNew=Array(n);
  for(var i=0;i<arrI.length;i++){    arrNew[i]=arrV[arrI[i]];    }
  return arrNew;
}
app.arr_max=function(arr){return Math.max.apply(null, arr);}


app.mySplice1=function(arr,iItem){ var item=arr[iItem]; for(var i=iItem, len=arr.length-1; i<len; i++)  arr[i]=arr[i+1];  arr.length = len; return item; }  // GC-friendly splice
app.myCopy=function(arr,brr){  if(typeof arr=="undefined") arr=[]; for(var i=0, len=brr.length; i<len; i++)  arr[i]=brr[i];  arr.length = len; return arr; }  // GC-friendly copy
//myCopy=function(arr,brr){  if(typeof arr=="undefined") arr=[]; arr.length=0; arr.push.apply(arr,brr);  }  // GC-friendly copy
app.myCompare=function(arr,brr){  var la=arr.length,lb=brr.length; if(la!=lb) return false; for(var i=0; i<la; i++)  if(arr[i]!=brr[i]) return false;  return true;}  // compare
  

app.addIndexColumn=function(M){    var Mt=Array();     for(var i=0;i<M.length;i++){  var tmp=[(i+1).toString()];   Mt[i]=tmp.concat(M[i]);  }       return Mt;      }
app.arrCopy=function(A){return [].concat(A);}

app.arrarrCopy=function(B){var A=[]; for(var i=0;i<B.length;i++) { A[i]=[].concat(B[i]);} return A; }

app.eliminateDuplicates=function(arr) {
  var i, len=arr.length, out=[], obj={};
  for (i=0;i<len;i++) { obj[arr[i]]=0; }
  for (i in obj) { out.push(i); }
  return out;
}


//
// string
//

app.ucfirst=function(string){  return string.charAt(0).toUpperCase() + string.slice(1);  }
app.isAlpha=function(star){  var regEx = /^[a-zA-Z0-9]+$/;  return str.match(regEx); } 
String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g,"");}

app.ltrim=function(str,charlist){
  if(charlist === undefined) charlist = "\\s";
  return str.replace(new RegExp("^[" + charlist + "]+"), "");
};
app.rtrim=function(str,charlist){
  if (charlist === undefined) charlist = "\\s";
  return str.replace(new RegExp("[" + charlist + "]+$"), "");
};

//pad2=function(n){ return ('0'+n).slice(-2);}
app.pad2=function(n) {return (n<10?'0':'')+n;}


//
// Math
//

app.isNumber=function(n) { return !isNaN(parseFloat(n)) && isFinite(n);}
app.sign=function(val){if(val<0) return -1; else if(val>0) return 1; else return 0;}

app.bound=function(value, opt_min, opt_max) {
  if (opt_min != null) value = Math.max(value, opt_min);
  if (opt_max != null) value = Math.min(value, opt_max);
  return value;
}

app.closest2Val=function(v, val){
  var bestFit=Number.MAX_VALUE, curFit, len=v.length, best_i;
  for(var i=0;i<len;i++){
    curFit=Math.abs(v[i]-val);
    if(curFit<bestFit) {bestFit=curFit; best_i=i;}
  }
  return [v[best_i],best_i];
}


//
// Random
//

app.randomHash=function(){ return Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2);}

app.myUUID=function(){
  var array = new Uint32Array(4);
  app.crypto.getRandomValues(array);
  var Str=Array(4);
  for (var i = 0; i < array.length; i++) { Str[i]=array[i].toString(16).padStart(8,"0"); }
  return Str.join("");
}


//
// Dates and time
//

app.getTUnix=function(){return Math.round(new Date().getTime()/1000);}
app.swedDate=function(tmp){ if(tmp) {tmp=UTC2JS(tmp);  tmp=tmp.getFullYear()+'-'+pad2(tmp.getMonth()+1)+'-'+pad2(tmp.getDate());}  return tmp;}
app.swedTime=function(tmp){ if(tmp) {tmp=UTC2JS(tmp);  tmp=tmp.getFullYear()+'-'+pad2(tmp.getMonth()+1)+'-'+pad2(tmp.getDate())+' '+pad2(tmp.getHours())+':'+pad2(tmp.getMinutes());}  return tmp;}
var UTC2JS=function(utcTime){ var tmp=new Date(Number(utcTime)*1000);  return tmp;  }
var UTC2Readable=function(utcTime){ var tmp=new Date(Number(utcTime)*1000);   return tmp.toLocaleString();  }

app.TUnitLenS= {s:1,m:60,h:3600,d:3600*24,y:3600*24*365};
//app.IntMaxTimeUnit=[99,99,36,365];
app.IntMaxTimeUnit={s:99,m:99,h:36,d:365};
app.IntMaxTimeUnitS={s:99,m:99*60,h:36*3600,d:365*24*3600};
app.getSuitableTimeUnit=function(t){ // t in seconds
  var tabs=Math.abs(t), tsign=t>=0?+1:-1;
  if(tabs<=IntMaxTimeUnit.s) return [tsign*tabs,'s'];
  tabs/=60; // t in minutes
  if(tabs<=IntMaxTimeUnit.m) return [tsign*tabs,'m']; 
  tabs/=60; // t in hours
  if(tabs<=IntMaxTimeUnit.h) return [tsign*tabs,'h'];
  tabs/=24; // t in days
  if(tabs<=IntMaxTimeUnit.d) return [tsign*tabs,'d'];
  tabs/=365; // t in years
  return [tsign*tabs,'y'];
}
app.getSuitableTimeUnitStr=function(tdiff,objLang=langHtml.timeUnit,boLong=0,boArr=0){
  var [ttmp,u]=getSuitableTimeUnit(tdiff), n=Math.round(ttmp);
  var strU=objLang[u][boLong][Number(n!=1)];
  if(boArr){  return [n,strU];  } else{  return n+' '+strU;   }
}

app.SuitableTimeUnit_getNextTick=function(t){ // t in seconds
  var tabsS=Math.abs(t);
  if(tabsS<=IntMaxTimeUnitS.s) return TUnitLenS.s;
  if(tabsS<=IntMaxTimeUnitS.s+TUnitLenS.m) return tabsS-IntMaxTimeUnitS.s;
  if(tabsS<=IntMaxTimeUnitS.m) return TUnitLenS.m; 
  if(tabsS<=IntMaxTimeUnitS.m+TUnitLenS.h) return tabsS-IntMaxTimeUnitS.m;
  if(tabsS<=IntMaxTimeUnitS.h) return TUnitLenS.h;
  if(tabsS<=IntMaxTimeUnitS.h+TUnitLenS.d) return tabsS-IntMaxTimeUnitS.h;
  if(tabsS<=IntMaxTimeUnitS.d) return TUnitLenS.d;
  if(tabsS<=IntMaxTimeUnitS.d+TUnitLenS.y) return tabsS-IntMaxTimeUnitS.d;
  return TUnitLenS.y;
}

//
// Data Formatting
//

app.print_r=function(o,boHTML){
  var tmp=JSON.stringify(o,null,'\t');
  if(typeof(boHTML) !='undefined' && boHTML) tmp=tmp.replace(/\n/g,'<br>').replace(/\t/g,'&nbsp;&nbsp;&nbsp;'); return tmp;
}
app.myDump=function(o){
  alert(print_r(o));
}

app.isValidHttpUrl=function(str) {
  //if(str.indexOf(' ')!=-1) return false;
  if(/\s/g.test(str)) return false;
  let url;
  try{ url = new URL(str); } catch(e) { return false;  }
  if(url.protocol!="http:" && url.protocol!="https:") return false;
  return url.href;
}


//
// Escaping data
//

app.myJSEscape=function(str){return str.replace(/&/g,"&amp;").replace(/</g,"&lt;");}
  // myAttrEscape
  // Only one of " or ' must be escaped depending on how it is wrapped when on the client.
app.myAttrEscape=function(str){return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/\//g,"&#47;");} // This will keep any single quataions.
app.myLinkEscape=function(str){ str=myAttrEscape(str); if(str.startsWith('javascript:')) str='javascript&#58;'+str.substr(11); return str; }



