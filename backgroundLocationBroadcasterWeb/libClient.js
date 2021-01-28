"use strict"

//
// Storage, DOM etc
//

var getItem=function(name,defaultVal) {    var tmp=localStorage.getItem(name);   if(tmp!==null) tmp=JSON.parse(tmp); else tmp=defaultVal; return tmp;   }
var setItem=function(name,value) {  if(typeof value=='undefined') value=null; localStorage[name]=JSON.stringify(value); }
var getItemS=function(name,defaultVal) {    var tmp=sessionStorage.getItem(name);    if(tmp!==null) tmp=JSON.parse(tmp); else tmp=defaultVal; return tmp;   }
var setItemS=function(name,value) {  sessionStorage[name]=JSON.stringify(value); }


//
// Hardware checking
//

var isTouchDevice=function() {  
  try {    document.createEvent("TouchEvent");    return true;   }
  catch (e) {   return false;   }  
}

var getBrowser=function(){
    var ua=navigator.userAgent.toLowerCase();

    var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
        /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
        /(msie) ([\w.]+)/.exec( ua ) ||
        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
        [];

    var brand=match[ 1 ] || "";
    var version=match[ 2 ] || "0";
    
    return {brand:brand,version:version};
};

var detectIE=function() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
       // IE 12 => return version number
       return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}



var extend=function(out) {
  out=out||{};
  for(var i=1; i<arguments.length; i++) {
    if(!arguments[i]) continue;
    for(var key in arguments[i]) {    if(arguments[i].hasOwnProperty(key)) out[key]=arguments[i][key];     }
  }
  return out;
};

/*******************************************************************************************************************
 * DOM handling (non-jQuery)
 *******************************************************************************************************************/

var findPos=function(el) {
  var rect = el.getBoundingClientRect();
  //return {top:rect.top+document.body.scrollTop, left:rect.left + document.body.scrollLeft};
  return {top:rect.top+window.scrollY, left:rect.left + window.scrollX};
}
//var findPosMy=function(el) {
  //var curleft = 0, curtop = 0;
  //while(1){
    //curleft += el.offsetLeft; curtop += el.offsetTop;
    //if(el.offsetParent) el = el.offsetParent; else break;
  //}
  //return { left: curleft, top: curtop };
//}


var removeChildren=function(myNode){
  while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
  }
}

var scrollTop=function(){ return window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop; }
var scrollLeft=function(){ return window.pageXOffset || (document.documentElement || document.body.parentNode || document.body).scrollLeft; }

//EventTarget.prototype.on=EventTarget.prototype.addEventListener;
EventTarget.prototype.on=function(){ this.addEventListener.apply(this, [...arguments]); return this; }
//EventTarget.prototype.off=EventTarget.prototype.removeEventListener;
EventTarget.prototype.off=function(){ this.removeEventListener.apply(this, [...arguments]); return this; }
if(!Node.prototype.append) Node.prototype.append=Node.prototype.appendChild;
if(!Node.prototype.prepend) Node.prototype.prepend=function(el){ this.insertBefore(el, this.firstChild);  }
Node.prototype.myAppend=function(){ this.append.apply(this, [...arguments]); return this; }
//Element.prototype.attr=Element.prototype.getAttribute;
Node.prototype.myBefore=function(elN){
  this.parentNode.insertBefore(elN,this); return this;
}
Node.prototype.empty = function() {
  while (this.lastChild) {
    this.lastChild.remove();
  }
  return this;
}
Element.prototype.insertChildAtIndex=function(child, index){
  if(!index) index=0;
  if(index >= this.children.length){
    this.appendChild(child);
  }else{
    this.insertBefore(child, this.children[index]);
  }
}
Element.prototype.attr=function(attr, value) {
  if(!attr) return;
  if(typeof attr=='string') {
    if(arguments.length<2) return this.getAttribute(attr);
    this.setAttribute(attr, value); return this;
  }
  for(var key in attr) { this.setAttribute(key, attr[key]);}
  return this;
}
//Node.prototype.prop=function(arg1, boChildren=false){
  //if(typeof arg1=='string') return this[arg1];
  //if(this instanceof DocumentFragment) boChildren=true;
  //if(!boChildren) Object.assign(this, arg1);
  //else  this.childNodes.forEach(function(elA){ Object.assign(elA, arg1);  });
  //return this;
//}
Element.prototype.prop=function(prop, value) {
  if(!prop) return;
  if(typeof prop=='string') {
    if(arguments.length<2) return this[prop];
    this[prop]=value; return this;
  }
  for(var key in prop) { this[key]=prop[key];}
  return this;
}
Element.prototype.css=function(style, value) {
  if(!style) return;
  if(typeof style=='string') {
    if(arguments.length<2) return this.style[style];
    this.style[style]=value; return this;
  }
  for(var key in style) { this.style[key]=style[key];}
  return this;
}
//for(var i=0; i<arguments.length; i++) this.append(arguments[i]);
Element.prototype.addClass=function() {this.classList.add(...arguments);return this;}
Element.prototype.removeClass=function() {this.classList.remove(...arguments);return this;}


//Node.prototype.css=function(styles, boChildren=false){
  //if(this instanceof DocumentFragment) boChildren=true;
  //if(!boChildren) Object.assign(this.style, styles);
  //else  this.childNodes.forEach(function(elA){ Object.assign(elA.style, styles);  });
  //return this;
//}
//Node.prototype.css=function(styles){ Object.assign(this.style, styles);  return this;  }
Node.prototype.cssChildren=function(styles){  this.childNodes.forEach(function(elA){ Object.assign(elA.style, styles);  }); return this;  }
//Node.prototype.cssChildren=function(styles){
  //var arr=this; if(this instanceof Node) arr=this.childNodes;
  //arr.forEach(function(elA){ Object.assign(elA.style, styles);  }); return this;
//}
//cssChildren=function(obj, styles){
  //var arr; if(obj instanceof Node) arr=obj.childNodes; else arr=obj;
  //arr.forEach(function(elA){ Object.assign(elA.style, styles);  });
//}
//cssChildren=function(styles){
  //var arr; if(this instanceof Node) arr=obj.childNodes; else arr=this;
  //arr.forEach(function(elA){ Object.assign(elA.style, styles);  }); return this; }
//Array.prototype.cssChildren=function(styles){ this.forEach(function(elA){ Object.assign(elA.style, styles);  }); return this; }
Node.prototype.myText=function(str=' '){
  if(typeof str!='string') { if(str===null) str=' '; str=str.toString(); }
  if(!this.firstChild) { this.textContent=str||' '; return this;}
  this.firstChild.nodeValue=str||' ';  return this;
}
Node.prototype.myHtml=function(str=' '){
  if(typeof str!='string') { if(str===null) str=' '; str=str.toString(); }
  if(!this.firstChild) { this.innerHTML=str||' '; return this;}
  this.firstChild.nodeValue=str||' ';  return this;
}
//Node.prototype.hide=function(){this.style.display='none'; return this;}
//Node.prototype.show=function(){this.style.display = '';  return this;}
//Node.prototype.toggle=function(b, strVis=''){if(typeof b=='undefined') b=this.style.display=='none'?1:0; this.style.display=b?strVis:'none'; return this;}
Node.prototype.hide=function(){
  if(this.style.display=='none') return this;
  this.displayLast=this.style.display;
  this.style.display='none';
  return this;
}
Node.prototype.show=function(){
  if(this.style.display!='none') return this;
  if(typeof this.displayLast!='undefined') var tmp=this.displayLast; else var tmp='';
  this.style.display=tmp;
  return this;
}
Node.prototype.toggle=function(b){
  if(typeof b=='undefined') b=this.style.display=='none'?1:0;
  if(b==0) this.hide(); else this.show();
  return this;
}
NodeList.prototype.toggle=function(b){
  if(typeof b=='undefined') {if(this.length) b=this[0].style.display=='none'?1:0; else return this;}
  this.forEach(function(ele){ ele.toggle(b); });
  return this;
}
var createTextNode=function(str){ return document.createTextNode(str); }
var createElement=function(str){ return document.createElement(str); }
//var createFragment=function(){ return document.createDocumentFragment(); }
var createFragment=function(){ fr=document.createDocumentFragment(); if(arguments.length) fr.append(...arguments); return fr; }

var getNodeIndex=function( elm ){ return [...elm.parentNode.children].indexOf(elm); }
Element.prototype.myIndex=function() {return [...this.parentNode.children].indexOf(this);}

Element.prototype.offset=function() {
  var rect = this.getBoundingClientRect();
  return { top: rect.top + document.body.scrollTop,  left: rect.left + document.body.scrollLeft  };
}

Element.prototype.visible = function() {    this.style.visibility='';  return this;};
Element.prototype.invisible = function() {    this.style.visibility='hidden'; return this; };
Element.prototype.visibilityToggle=function(b){
  if(typeof b=='undefined') b=this.style.visibility=='hidden'?1:0;
  this.style.visibility= b?'':'hidden';
  return this;
};

Node.prototype.detach=function(){ this.remove(); return this; }

var isVisible=function(el) {
  return !!( el.offsetWidth || el.offsetHeight || el.getClientRects().length );
}

//
// JQuery extentions
//
/*
$.fn.push = function(selector) {
    Array.prototype.push.apply(this, $.makeArray($(selector)));
    return this;
};*/
//$.fn.pushOne = function(selector){
    //Array.prototype.push.apply(this, $.makeArray($(selector)));
    //return this;
//};
//$.fn.push = function(){
  //for(var i=0; i<arguments.length; i++){
    //this.pushOne(arguments[i]);
  //}
  //return this;
//}
//$.fn.visible = function() {    return this.css('visibility', 'visible');  };
//$.fn.invisible = function() {    return this.css('visibility', 'hidden');  };




/*******************************************************************************************************************
 * popupHover: popup a elBubble when you hover over elArea
 *******************************************************************************************************************/
var popupHover=function(elArea, elBubble, tClose=4){
  elBubble.css({position:'absolute', 'box-sizing':'border-box', margin:'0px', 'text-align':'left'}); //
  function setBubblePos(e){
    var xClear=6, yClear=6;
    var x = e.pageX, y = e.pageY;

    var borderMarg=10;
    var winW=window.innerWidth,winH=window.innerHeight,   bubW=elBubble.clientWidth,bubH=elBubble.clientHeight,   scrollX=scrollLeft(),scrollY=scrollTop();


    var boRight=true, boBottom=true;

    var boMounted=Boolean(elBubble.parentNode);
    if(boMounted){
      var xFar=x+xClear+bubW, xBorder=scrollX+winW-borderMarg;
      if(xFar<xBorder){ 
        x=x+xClear;
      } else {
        x=x-bubW-xClear;  // if the bubble doesn't fit on the right side then flip to the left side
        //x=x-xClear; boRight=false;
      }
        
      var yFar=y+yClear+bubH, yBorder=scrollY+winH-borderMarg;
      if(yFar<yBorder) {
        y=y+yClear;
      }else{ 
        y=y-bubH-yClear;   // if the bubble doesn't fit below then flip to above
        //y=y-yClear; boBottom=false;
      }
    } else {
      x=x+xClear;
      y=y+yClear;
    }
    if(x<scrollX) x=scrollX;
    if(y<scrollY) y=scrollY;
    elBubble.style.top=y+'px'; elBubble.style.left=x+'px';
    //if(boRight) {elBubble.style.left=x+'px'; elBubble.style.right='';} else {elBubble.style.left=''; elBubble.style.right=x+'px'; }
    //if(boBottom) {elBubble.style.top=y+'px'; elBubble.style.bottom='';} else {elBubble.style.top=''; elBubble.style.bottom=y+'px'; } 
  };
  var closeFunc=function(){ 
    if(boTouch){ 
      elBubble.remove(); 
      if(boIOSTmp) elBlanket.remove();
      clearTimeout(timer);
    }
    else { elBubble.remove();  }
  }
  var elBlanket, timer, boIOSTmp=boTouch;
  if(boIOSTmp){
    elBlanket=createElement('div').css({'background':'#555',opacity:0,'z-index': 9001,top:'0px',left:'0px',width:'100%',position:'fixed',height:'100%'});
    elBlanket.on('click', closeFunc);
  }
  if(boTouch){
    elArea.on('click', function(e){
      e.stopPropagation();
      if(elBubble.parentNode) closeFunc();
      else {
        elBody.appendChild(elBubble);   setBubblePos(e);
        clearTimeout(timer);  if(tClose) timer=setTimeout(closeFunc, tClose*1000);
        if(boIOSTmp) elBody.appendChild(elBlanket);
      }
    });
    elBubble.on('click', closeFunc);
    elHtml.on('click', closeFunc);
    
  }else{
    elArea.on('mousemove', setBubblePos);  
    elArea.on('mouseenter', function(e){elBody.appendChild(elBubble);});
    elArea.on('mouseleave', closeFunc);
  }
  elBubble.classList.add('popupHover'); 
}



