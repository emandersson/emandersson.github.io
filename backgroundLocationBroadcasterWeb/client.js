

// python3 -m http.server


// If tInterval is greater than 20s then send an request at startBGWork
// closebymarket: Obscuring (rounding) seem to be too little in the map.
// mmmWiki: link wrapping as if left-side buttons where floats.
// 🗝




"use strict"
window.onload=function(){

/*******************************************************************************************************************
 *******************************************************************************************************************
 *
 * History stuff
 *
 *******************************************************************************************************************
 *******************************************************************************************************************/

app.histGoTo=function(view){}
app.doHistBack=function(){  history.back();}
app.doHistPush=function(obj){
    // Set "scroll" of stateNew  (If the scrollable div is already visible)
  var view=obj.view;
  var scrollT=window.scrollTop();
  if(typeof view.setScroll=='function') view.setScroll(scrollT); else history.StateMy[history.state.ind].scroll=scrollT;  //view.intScroll=scrollT;

  if((boChrome || boOpera) && !boTouch)  history.boFirstScroll=true;

  var indNew=history.state.ind+1;
  stateTrans={hash:history.state.hash, ind:indNew};  // Should be called stateLast perhaps
  history.pushState(stateTrans, strHistTitle, uCanonical);
  history.StateMy=history.StateMy.slice(0, indNew);
  history.StateMy[indNew]=obj;
}

app.doHistReplace=function(obj, indDiff=0){
  history.StateMy[history.state.ind+indDiff]=obj;
}
app.changeHist=function(obj){
  history.StateMy[history.state.ind]=obj;
}
app.getHistStatName=function(){
  return history.StateMy[history.state.ind].view.toString();
}


history.distToGoal=function(viewGoal){
  var ind=history.state.ind;
  var indGoal;
  for(var i=ind; i>=0; i--){
    var obj=history.StateMy[i];
    var view; if(typeof obj=='object') view=obj.view; else continue;
    if(view===viewGoal) {indGoal=i; break;}
  }

  var dist; if(typeof indGoal!='undefined') dist=indGoal-ind;
  return dist;
}
history.fastBack=function(viewGoal, boRefreshHash){
  var dist=history.distToGoal(viewGoal);
  if(dist) {
    if(typeof boRefreshHash!='undefined') history.boResetHashCurrent=boRefreshHash;
    history.go(dist);
  }
}


var colSim='black', colSimMinus='lightgrey', colPostMinus='#99f', colMeasMinus='#fab', colProp='blue', colNoise='black', colMeas='magenta', colPri='#7ff', colPost='cyan', colCalc='blue';


var divMessageTextCreate=function(){
  var spanInner=createElement('span');
  var imgBusyLoc=imgBusy.cloneNode().css({zoom:'65%','margin-left':'0.4em'}).hide();
  var el=createElement('div').myAppend(spanInner, imgBusyLoc);
  el.resetMess=function(time){
    clearTimeout(messTimer);
    if(time) { messTimer=setTimeout(resetMess, time*1000); return; }
    spanInner.myText(' ');
    imgBusyLoc.hide();
  }
  el.setMess=function(str='',time,boRot){
    spanInner.myText(str);
    clearTimeout(messTimer);
    if(time)     messTimer=setTimeout(resetMess, time*1000);
    imgBusyLoc.toggle(Boolean(boRot));
  };
  el.setHtml=function(str='',time,boRot){
    spanInner.myHtml(str);
    clearTimeout(messTimer);
    if(time)     messTimer=setTimeout(resetMess, time*1000);
    imgBusyLoc.toggle(Boolean(boRot));
  };
  var messTimer;
  el.addClass('message');
  return el;
}


var viewTableCreator=function(){
  var el=createElement('div');
  if(boTouch){  var strMoveEv='touchmove', strEndEv='touchend'; }  else{   var strMoveEv='mousemove', strEndEv='mouseup';    }
  var iStart, iEnd;
  var myMousedown= function(e){
    var e = e || window.event; if(e.which==3) return;
    movedRow=this.parentNode;
    iStart=getNodeIndex(movedRow);
    movedRow.css({position:'relative', opacity:0.55, 'z-index':'auto'});  
    document.on(strMoveEv,myMousemove, {passive: false}); document.on(strEndEv,el.myMouseup);
    e.preventDefault(); // to prevent mobile crome from reloading page
    //setMess('Down');
  } 
  el.myMouseup= function(e){ 
    //movedRow.css({position:'relative', opacity:1, 'z-index':'auto', top:'0px'});
    movedRow.css({'transform':'translateY(0px)',opacity:1,'z-index':'auto'});
    document.off(strMoveEv,myMousemove); document.off(strEndEv,el.myMouseup);
    //setMess(print_r(el.myGet(), 1));
    iEnd=movedRow.myIndex();
    Row=el.Row=[...divCont.children];
    if(boNativeAndroid) Android.moveRow(iStart,iEnd); else setItems();
  }
  
  var y, topCur;
  var myMousemove= function(e){
    var x,y;
    if(boTouch) {e.preventDefault(); e.stopPropagation(); x=e.changedTouches[0].pageX; y=e.changedTouches[0].pageY;}
    else {y=e.clientY;}

    //var iCur=getNodeIndex(movedRow);
    var iCur=movedRow.myIndex();
    var hCur=movedRow.offsetHeight, yMouseOff=y-hCur/2;

    var len=Row.length;

    if(iCur>0) {  //Check if previous is better
      var tmp=movedRow.previousElementSibling;
      var yPrevOff=tmp.getBoundingClientRect().top;
      var hPrev=tmp.offsetHeight;
      if(y<yPrevOff+hPrev/2) { tmp.insertAdjacentElement('beforebegin', movedRow); }
    }
    if(iCur<len-1) { //Check if next is better
      var tmp=movedRow.nextElementSibling;
      var yNextOff=tmp.getBoundingClientRect().top;
      var hNext=tmp.offsetHeight;
      if(y>yNextOff+hNext/2) { tmp.insertAdjacentElement('afterend', movedRow); }
    }
    var yCurOff=movedRow.offsetTop;
    movedRow.css({'transform':'translateY('+(yMouseOff-yCurOff)+'px)'});
  };

  el.setUp=function(arrURI){    Row.forEach(ele=>ele.remove());    el.myAdd(arrURI);  } 
  //el.myGet=function(arrO=[]){  arrO.length=0;    Row.forEach(function(ele,i){arrO[i]=ele.attr("name");}); return arrO;   }
  var movedRow; 
  var colOn='#3d3', colOff='#aaa';

  var cssSort={cursor:'pointer', padding:'0.6em 0.7em', width:'200px', margin:'2px 0px', 'background':'#aaa'};
  var cssNorm={cursor:'', padding:'', width:'', margin:'', 'background':''};
  el.setType=function(type){
    Row.forEach(function(r,i){
      var spanDrag=r.querySelector('[name=spanDrag]'), cbEnable=r.querySelector('[name=cbEnable]'), spanUri=r.querySelector('[name=spanUri]'), buttConnect=r.querySelector('[name=buttonConnect]'), spanMess=r.querySelector('[name=spanMess]'), spanEdit=r.querySelector('[name=spanEdit]');  //spanRole=r.querySelector('[name=spanRole]')
      var aLink=r.querySelector('[name=aLink]'); //spanSafariFix=r.querySelector('[name=spanSafariFix]');
      var boMain=type=='main', boManage=type=='manage';
      if(boMain) {
        var inpT=r.querySelector('input:checked'); r.toggle(Boolean(inpT)); 
      }else if(boManage) { r.show();  }
      aLink.toggle(boMain);
      spanMess.toggle(boMain); //buttConnect.toggle(boMain);
      spanDrag.toggle(boManage); cbEnable.toggle(boManage); spanEdit.toggle(boManage); //spanSafariFix.toggle(boManage); 
      
      spanLock.toggle(boMain); spanEnabled.toggle(boManage);
    });
  }

  el.myAdd=function(arrURI){
    for(var i=0;i<arrURI.length;i++) { 
      var persistData=arrURI[i], {uri, boEnable, strUUID, iRole}=persistData;
      var row=createElement('div').prop('persistData', persistData).css({overflow:'hidden'});
      row.css(cssNorm).css({'word-break':'break-all'}); //
      Row.push(row);
      var spanDrag=createElement('span').attr('name', 'spanDrag').myText('⣿').css({ 'float':'left', 'font-size':'1.8em', 'color':'gray', 'cursor':'pointer', 'text-align':'center', 'width':'1.3em', display:'inline-block'}); //.addClass('unselectable').prop({UNSELECTABLE:"on"});
        if(boTouch) spanDrag.on('touchstart', myMousedown); else spanDrag.on('mousedown', myMousedown);
      var cbEnable=createElement('input').attr('name', 'cbEnable').prop({type:'checkbox', checked:boEnable}).css({ 'float':'left', width:'2.4em', height:'2.4em'}).on('click',cbEnableClick);
      //if(boFF || boOpera){ cbEnable.css({'transform':'scale(2,2)'}); }
      //else if((boAndroid && !boChrome)) cbEnable.css({'-webkit-transform':'scale(2,2)', width:'', height:''}); 
      var aLink=createElement('a').attr({'name':'aLink', href:uri}).myText('link').css({ 'font-size':'80%', 'vertical-align':'calc(0.5rem - 40%)', 'font-weight':'bold', 'word-break':'normal'});
      //var spanGhost=createElement('span').css({'height':'100%'});
      var spanSafariFix=createElement('span').attr('name', 'spanSafariFix').myHtml('&nbsp; ').css({'display': 'inline-block', width:'0px'});
      var spanUri=createElement('span').attr('name', 'spanUri').myText(uri).css({'word-break':'break-all'}).css({opacity:boEnable?1:0.4});
      var spanRole=createElement('span').attr('name', 'spanRole').myText(iRole?'Sell­er':'Cust­omer').css({'font-size':'85%', 'float':'right', margin:'0 0.4em'});
      //var imgLock=createElement('img').prop({src:flLockRed}).attr('name', 'imgLock').css({height:strSizeIconEm, width:strSizeIconEm, 'float':'right'});
        //var imgTmp=imgKey.cloneNode();  if(strUUID) imgTmp.prop({src:flKey});
      //var buttConnect=createElement('button').myAppend(imgTmp).addClass('imageButton').css({'float':'right'}).on('click',buttonConnectClick).attr('name', 'buttonConnect');
        var divTmp; if(strUUID) divTmp=divKey.cloneNode(1); else divTmp=divKeyVoidW.cloneNode(1);
      var buttConnect=createElement('button').myAppend(divTmp).addClass('imageButton').css({'float':'right'}).on('click',buttonConnectClick).attr('name', 'buttonConnect');
      var buttEdit=createElement('button').attr('name', 'buttonEdit').myText('Edit').on('click', viewEditPop.openFunc);
      var buttDelete=createElement('button').attr('name', 'buttonDelete').css({'margin-right':'0.2em'}).myAppend('✖').on('click', viewDeleteUriPopup.openFunc);  //imgDelete.cloneNode()
      var spanEdit=createElement('span').attr('name', 'spanEdit').myAppend(buttDelete).css({'float':'right', 'font-size':'1em', 'font-family':'sans-serif'}); //buttEdit, 
      var spanMess=createElement('span').attr('name', 'spanMess').css({'font-size':'85%', 'font-style':'italic', margin:'0 0.2em', 'vertical-align':'calc(0.5rem - 40%)'}); //.myText('ff');
      row.append(spanDrag, cbEnable, buttConnect, spanEdit, spanSafariFix, spanUri, ' ', aLink, ' ', spanMess);   //, imgLock , spanRole
      //row.myAppend('awefhofadfaaaadeffdassdffggggggg jkafoaef asef asdfji sdfseff');   //, imgLock , spanUri, aLink
      buttConnect.hide();spanMess.hide();
      divCont.append(row);
    }
    //var strName=currentHistName();  (arrStateFunc[strName])();
    history.StateMy[history.state.ind].view.setVis();

    //spanLock.visibilityToggle(Boolean(Row.length));
  }
  el.myRemove=function(r){
    var iRow=r.myIndex();
    r.remove();
    Row=el.Row=[...divCont.children];
    //spanLock.visibilityToggle(Boolean(Row.length));
    if(boNativeAndroid) Android.deleteRow(iRow); else setItems();
  }
  
    // contains: used to prevent multiple uri's to be added.
  el.contains=function(uri){
    var boY=false;
    Row.forEach(function(ele, i){ if(ele.persistData.uri==uri) boY=true; })
    return boY;
  }
  
  var cbEnableClick=function(){
    var cb=this, r=cb.parentNode, iRow=r.myIndex();
    var boEnable=cb.prop('checked');
    r.querySelector('[name=spanUri]').css({opacity:boEnable?1:0.4});
    r.persistData.boEnable=boEnable;
    if(boNativeAndroid) Android.toggleRow(iRow,boEnable); else setItems();
  }
  el.setAllMess=function(strMess){
    Row.forEach(function(ele, i){ ele.querySelector('[name=spanMess]').myText(strMess).css({'color':''}); })
  }
  el.setMess=function(iRow, strMess){
    var strCol=''; 
    if(typeof strMess=='string'){
      if(strMess.substr(0,7)=='Visible') strCol='#3d3';
      else if(strMess.substr(0,6)=='Hidden') strCol='red';
    }
    var r=Row[iRow];
    r.querySelector('[name=spanMess]').myText(strMess).css({'color':strCol});
  }
  el.getData=function(){
    var MTab=[];
    Row.forEach(function(ele, i){
      var boEnable=ele.querySelector('[name=cbEnable]').prop('checked');
      MTab.push(ele.persistData);
    });
    return MTab;
  }
  el.getNRow=function(){return Row.length;}
  
      //
      // Used in webapp only
      //
      
  var makeReturnFunc=function(ele){ return function(data, textStatus, jqXHR){ 
    var iRow=ele.myIndex();
    el.setMess(iRow, data);    
  }};
  el.sendAllOn=function(pos){
    if(boNativeAndroid) {var {lat,lng}=pos;} //.toFixed(8)
    else {var lat=pos.coords.latitude.toFixed(8), lng=pos.coords.longitude.toFixed(8);}
    var hideTimer=viewFront.selHideTimer.valN();
    viewTable.setAllMess('Sending position ...');
    sendAllMess({boShow:true, hideTimer, lat, lng});
  }
  el.sendAllOff=function(){  sendAllMess({boShow:false});  }
  el.sendAllCheck=function(){  sendAllMess({boCheck:true});  }
  var sendAllMess=function(objMess){
    Row.forEach(function(r, i){
      var boEnable=r.querySelector('[name=cbEnable]').prop('checked');
      if(boEnable) sendMess(r, objMess);
    });
  }
  var sendMess=function(row, objMess){
    var {strUUID, iRole, iSeq}=row.persistData; iSeq++;
    row.persistData.iSeq=iSeq;
    if(strUUID.length==0) {el.setMess(row.myIndex(), 'No key pair created'); return;}
    //objMess.iRole=iRole; objMess.iSeq=iSeq;
    extend(objMess, {iRole,iSeq, keyRemoteControl:strUUID})
    var originalText=JSON.stringify(objMess);
    
    var params="?dataFromRemoteControl="+encodeURIComponent(originalText); //+"&keyRemoteControl="+encodeURIComponent(strUUID);
    var url=row.persistData.uri+'/'+params;
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    var retFunc=makeReturnFunc(row);
    xhr.onload=function () {
      //var dataFetched=this.response;
      var dataFetched=myJSEscape(this.response);
      //var data; try{ data=JSON.parse(dataFetched); }catch(e){  dataFetched=myJSEscape(dataFetched); setMess(e+': '+dataFetched);  return; }
      //var data=this.response;
      retFunc(dataFetched);
    }
    xhr.onerror=function(e){ var tmp=`Error, type:${e.type}, statusText:${xhr.statusText}`;  setMess(tmp); console.log(tmp);   throw 'bla';}
    xhr.send();
    
  }


    
  var buttonConnectClick=function(e){
    var r=this.parentNode;
    var iRow=r.myIndex();
    
    var strMess='...'; 
    el.setMess(iRow, strMess);
    //worker.postMessage(iRow);
    var strUUID=myUUID();
    extend(r.persistData, {strUUID, iSeq:0});
    var divTmp=divKey.cloneNode(1); r.querySelector('[name=buttonConnect]').empty().append(divTmp);
    var uri=r.persistData.uri+'?keyRemoteControl='+encodeURIComponent(strUUID);
    location.assign(uri);
    if(boNativeAndroid) Android.setKey(iRow,strUUID); else setItems();
  }

  var lenKey=1024;
  //var imgKey=imgProt.cloneNode().prop({src:flKeyEmpty});
  var divKeyShadow=createElement('div').myText('🔑').css({'text-shadow':'-.5px 0 grey, .5px 0 grey, 0 -.5px grey, 0 .5px grey, -.5px -.5px grey, .5px .5px grey, -.5px .5px grey, .5px -.5px grey', color:'transparent'});
  var divKeyVoid=createElement('div').myText('🔑').css({'text-shadow':'-1px 0 #eee', color:'transparent', position:'absolute', left: '1px', top:'0px', width:'100%'});
  var divKeyVoidW=createElement('div').myAppend(divKeyShadow,divKeyVoid).css({ position:'relative'});
  var divKey=createElement('div').myText('🔑').css({'text-shadow':'-1px 0 black', color:'transparent', left: '1px', top:'0px'});
  //elBody.append(divKeyVoidW, divKey);
  var Row=el.Row=[];
    
    // Head
  var spanEnabled=createElement('span').myText(langHtml.Enabled).css({'font-weight':'bold'});
  var imgH=el.imgHelpHead=imgHelp.cloneNode(1).css({'margin-right':'0.6em'});   popupHover(imgH, createElement('div').myText('Click the "key"-button to create and store a new key.'));
  var spanLock=createElement('span').myAppend(imgH).css({'float':'right'});
  var spanA=createElement('a').prop({href:uWiki}).myText('Info').css({'font-size':'1.2em', 'font-weight':'bold'}); 
  var head=createElement('div').myAppend(spanEnabled, spanA).css({padding:'0', overflow:'hidden', 'text-align':'center', margin:'.5em auto .8em'}); //'max-width':menuMaxWidth+'px' , spanLock



  var divCont=createElement('div'); 
  //var tmp='button[name=buttonConnect]';   divCont.on('click', tmp, buttonConnectClick); 
  //var tmp='input[name=cbEnable]';   divCont.on('click', tmp, cbEnableClick); 
 
  el.append(head, divCont);
  el.addClass('unselectable'); el.prop({UNSELECTABLE:"on"});  //needed by firefox  //needed by opera, firefox and ie

  return el;
}

var workOverUri=function(uri){
  if(!(/^https?:\/\//.test(uri))){ uri="https://"+uri; }
  var boOK=isValidHttpUrl(uri);
  if(!boOK){  return ['Non-valid uri'];}
  //if(uri.length==0){ setMess('empty uri', 2); return;}
  //if(/^https?:\/\/$/.test(uri)) { setMess('empty domain', 2); return;}    
  uri=rtrim(uri, '/');
  return [null, uri];
}

  
var viewAddPopCreator=function(){
  var el=createElement('div')
  el.toString=function(){return 'addPop';}
  var save=function(){
    var uriTmp=inpURI.value.trim();
    if(/\s/g.test(uriTmp)) { setMess('white space in url', 2); return;  }
    var objUrl; try{ objUrl = new URL(uriTmp); } catch(e) { setMess(e, 2); return;  }
    var {hash, protocol, origin, pathname, search}=objUrl;
    if(hash.length==0) { setMess('No hashtag', 2); return;  }
    var strUUID=hash.substr(1);
    if(strUUID.length!=32) { setMess('strUUID length should be 32', 2); return;  }
    if(protocol!='https:') { setMess('protocol must be https', 2); return;  }
    var uri=origin+pathname;
    uri=rtrim(uri, '/');
    //var [err,uri]=workOverUri(inpURI.value); if(err) {setMess(err, 2); return;}
    if(viewTable.contains(uri)) { setMess('That uri is already in the list', 2); return;  } 
    var iRole=Number(inpRole.value);
    viewTable.myAdd([{uri, boEnable:true, strUUID, iSeq:0, iRole:iRole}]);
    if(boNativeAndroid) Android.addRow(uri, iRole, strUUID); else setItems();
    doHistBack();
    //el.closePop();
  }
  el.setVis=function(){ el.show(); return true;  }
  el.openFunc=function(){
    var  tmp=inpURI.value='';
    doHistPush({view:el}); el.setVis();
    inpURI.focus();
    return true;
  }
  
  var head=createElement('h3').myText(langHtml.addPopHead);
  var aListOfValidSites=createElement('a').prop({href:uListOfValidSites}).css({'font-size':'90%'}).myText('List of valid sites')
  
  var imgH=imgHelp.cloneNode(1).css({'margin-left':'1em'});   popupHover(imgH, createElement('div').myText('You should find this on the site you want to control.'));
  
  var labelURI=createElement('label').myText('Authentication url: ').css({'font-size':'90%'});
  var inpURI=createElement('input').prop({type:'url'}).css({width:'100%', 'margin-top':'0.4em'}).on('keypress', function(e){ if(e.which==13) {save();return false;}} ); //inpURI.css({display:'block', margin:'1em 0'});
  var sectionURI=createElement('section').css({display:'block', margin:'1em 0'}).myAppend(labelURI, aListOfValidSites, inpURI);  //, imgH
  var inpRole=createElement('select');  inpRole.myAppend( createElement('option').prop('value',0).myText('Customer'), createElement('option').prop('value',1).myText('Seller') );
  inpRole.css({'margin-bottom':'1em'});

  
  var buttonCancel=createElement('button').myText(langHtml.Cancel).on('click', doHistBack);
  var buttonSave=createElement('button').myText(langHtml.Save).on('click', save);
  var divBottom=createElement('div').myAppend(buttonCancel, buttonSave);
  
  var centerDiv=createElement('div').myAppend(head, sectionURI, divBottom); //, inpRole
  centerDiv.addClass("Center").css({'width':'20em', height:'17em', padding:'1.1em'});
  if(boIE) centerDiv.css({'width':'20em'});
  var blanket=createElement('div').addClass("blanket");
  el.addClass("Center-Container").myAppend(centerDiv,blanket); //
  el.css({'text-align':'left'});
  return el;
  
}



var viewEditPopCreator=function(){
  var el=createElement('div')
  el.toString=function(){return 'editPop';}
  var save=function(){
    var uriTmp=inpURI.value.trim();
    if(/\s/g.test(uriTmp)) { setMess('white space in url', 2); return;  }
    var objUrl; try{ objUrl = new URL(uriTmp); } catch(e) { setMess(e, 2); return;  }
    var {hash, protocol, origin, pathname, search}=objUrl;
    if(hash.length==0) { setMess('No hashtag', 2); return;  }
    var strUUID=hash.substr(1);
    if(strUUID.length!=32) { setMess('strUUID length should be 32', 2); return;  }
    if(protocol!='https:') { setMess('protocol must be https', 2); return;  }
    var uri=origin+pathname;
    uri=rtrim(uri, '/');
    //var [err,uri]=workOverUri(inpURI.value); if(err) {setMess(err, 2); return;}
    if(viewTable.contains(uri) && uri!=strStartUri) { setMess('That uri is already in the list', 2); return; } 
    curRow.querySelector("[name=spanUri]").myText(uri); curRow.persistData.uri=uri; curRow.persistData.strUUID=strUUID;
    iRole=Number(inpRole.value);
    //curRow.querySelector("[name=spanRole]").myText(iRole?'Seller':'Customer');
    curRow.persistData.iRole=iRole;
    var iRow=curRow.myIndex();
    if(boNativeAndroid) Android.editRow(iRow, uri, iRole, strUUID); else setItems();
    doHistBack();
    //el.closePop();
  }
  el.setVis=function(){ el.show(); return true;  }
  el.openFunc=function(){
    curRow=this.parentNode.parentNode;
    var {uri,iRole,strUUID}=curRow.persistData;
    strStartUri=uri; iRole=Number(iRole);
    inpURI.value=uri+'#'+strUUID;
    inpRole.value=iRole;
    doHistPush({view:el}); el.setVis();
    inpURI.focus();
    //el.openPop();
  }
 
  var curRow, strStartUri, iRole; 

  var head=createElement('h3').myText(langHtml.editPopHead);
  
  var imgH=imgHelp.cloneNode(1).css({'margin-left':'1em'});   popupHover(imgH, createElement('div').myText('You should find this on the site you want to control.'));
  
  var labelURI=createElement('label').myText('Authentication url from the site').css({'font-size':'90%'});
  var inpURI=createElement('input').prop({type:'url'}).css({width:'100%', 'margin-top':'0.4em'}).on('keypress', function(e){ if(e.which==13) {save();return false;}} ); //inpURI.css({display:'block', margin:'1em 0'});
  var sectionURI=createElement('section').css({display:'block', margin:'1em 0'}).myAppend(labelURI, imgH, inpURI);
  var inpRole=createElement('select');  inpRole.myAppend( createElement('option').prop('value',0).myText('Customer'), createElement('option').prop('value',1).myText('Seller') );
  inpRole.css({'margin-bottom':'1em'});

  var buttonClear=createElement('button').myText(langHtml.Clear).on('click', function(){ inpURI.value=""; inpURI.focus();  });
  var buttonSelectAll=createElement('button').myText(langHtml.SelectAll).on('click', function(){ inpURI.setSelectionRange(0, inpURI.value.length); inpURI.focus();  });
  var buttonCancel=createElement('button').myText(langHtml.Cancel).on('click', doHistBack);
  var buttonSave=createElement('button').myText(langHtml.Save).on('click', save);
  var divMiddle=createElement('div').myAppend(buttonSelectAll, buttonClear).css({'margin-bottom':'0.9em'});
  var divBottom=createElement('div').myAppend(buttonCancel, buttonSave);
  
  var centerDiv=createElement('div').myAppend(head, sectionURI, divMiddle, divBottom); //, inpRole
  centerDiv.addClass("Center").css({'width':'20em', height:'17em', padding:'1.1em'});
  if(boIE) centerDiv.css({'width':'20em'});
  var blanket=createElement('div').addClass("blanket");
  el.addClass("Center-Container").myAppend(centerDiv,blanket); //
  el.css({'text-align':'left'});
  return el;
}

var viewDeleteUriPopupCreator=function(){
  var el=createElement('div')
  el.toString=function(){return 'deleteUriPopup';}
  var ok=createElement('button').myText(langHtml.OK).css({'margin-top':'1em'}).on('click', function(){
    viewTable.myRemove(r);
    doHistBack();
  });
  el.setVis=function(){ el.show(); return true;  }
  el.openFunc=function(){
    r=this.parentNode.parentNode; spanUri.myText(r.persistData.uri);
    doHistPush({view:el}); el.setVis(); ok.focus()
  }
 
  var r;
  var head=createElement('h3').myText(langHtml.delete.head);
  var spanUri=createElement('span');//.css({'font-weight': 'bold'});
  var p=createElement('div').myAppend(spanUri);
  var cancel=createElement('button').myText(langHtml.Cancel).on('click', doHistBack).css({'margin-top':'1em'});
  
  var centerDiv=createElement('div').myAppend(head, p, cancel, ok);
  centerDiv.addClass("Center").css({'width':'20em', height:'15em', padding:'1.1em'});
  if(boIE) centerDiv.css({'width':'20em'});
  var blanket=createElement('div').addClass("blanket");
  el.addClass("Center-Container").myAppend(centerDiv,blanket); //
  el.css({'text-align':'left'});
  return el;
}



  //
  // viewPermissionPop
  //

  var viewPermissionPopCreator=function(){
    var el=createElement('div')
    el.toString=function(){return 'permissionPop';}
    el.setVis=function(){ el.show(); return true;  }
    el.openFunc=function(){
      doHistPush({view:el}); el.setVis();
      //el.openPop();
    }
    el.setUpAllowBut=function(boOK, boOKBG){
      if(!boBGAPI) boOKBG=boOK;
      var boShowTmp=!boOK || !boOKBG
      var boVis=el.style.display!="none"
      if(!boVis && boShowTmp) el.openFunc();
      else if(boVis && !boShowTmp) doHistBack();
       
      //menuAA.toggle(boShowTmp);
      spanOK.toggle(boOK); spanNOK.toggle(!boOK);
      spanOKBG.toggle(boOKBG); spanNOKBG.toggle(!boOKBG);
    }
   
  
    var head=createElement('h3').myText("Permissions to approve:");
    var buttAllowLoc=createElement('button').myAppend("Approve use of location").css({'margin-right':'0.4em', padding:'0.1em'}).on('click', function(){  
      Android.allowFine();
    });
    var buttAllowBGLoc=createElement('button').myAppend("Approve use of background location").css({'margin-right':'0.4em', padding:'0.1em'}).on('click', function(){
      if(spanOK.style.display=='none') { setMess("Approve location first",10); return; }
      Android.allowBG();
    });
    var colOrange='#a36a00';
    var spanOK=createElement('span').myAppend("Permission received").css({color:'green'}), spanNOK=createElement('span').myAppend("Permission  not received").css({color:colOrange});
    var spanOKBG=createElement('span').myAppend("Permission received").css({color:'green'}), spanNOKBG=createElement('span').myAppend("Permission  not received").css({color:colOrange});
    var divFine=createElement('div').myAppend(buttAllowLoc, spanOK, spanNOK);
    var divBG=createElement('div').myAppend(buttAllowBGLoc, spanOKBG, spanNOKBG);
    [divFine,divBG].forEach(ele=>ele.css({display:'flex', 'align-items':'center', 'margin-bottom':'0.4em'}));
    divBG.toggle(boBGAPI);

    var buttonCancel=createElement('button').myText(langHtml.Cancel).on('click', doHistBack);
    var divBottom=createElement('div').myAppend(buttonCancel).css({display:'flex', 'align-items':'center', 'margin-top':'0.6em'});
    
    var centerDiv=createElement('div').myAppend(head, divFine, divBG, divBottom);
    centerDiv.addClass("Center").css({'width':'20em', height:'17em', padding:'1.1em'});
    if(boIE) centerDiv.css({'width':'20em'});
    var blanket=createElement('div').addClass("blanket");
    el.addClass("Center-Container").myAppend(centerDiv,blanket); //
    el.css({'text-align':'left'});
    return el;
  }
  



  // 
  // viewFront
  //

var selHideTimerCreator=function(){
  var el=createElement('select');
  el.loadTimer=function(val){ 
    var [bestVal]=closest2Val(arrHideTime, val);  el.value=bestVal;
  }
  el.on('change', function(){
    var ele=this, val=Number(ele.value);
    if(boNativeAndroid) Android.setHideTimer(val); else setItems();
  });
  el.valN=function(){return Number(el.value);}

  //var arrHideTime=[0.25,1,2,5,10,15,20,30,40,60,90,2*60,3*60,4*60,5*60,6*60,8*60,10*60,12*60,18*60,24*60,36*60,2*24*60,3*24*60,4*24*60,5*24*60,6*24*60,7*24*60,14*24*60,30*24*60];
  //for(var i=0;i<arrHideTime.length;i++) arrHideTime[i]*=60;
  var arrHideTime=[15,60,120, 300,600,15*60,20*60,30*60,40*60,3600,1.5*3600,2*3600,3*3600,4*3600,5*3600,6*3600,8*3600,10*3600,12*3600,18*3600,86400,1.5*86400,2*86400,3*86400,4*86400,5*86400,6*86400,7*86400,14*86400,30*86400], len=arrHideTime.length; //,intMax
 
  //if(!boSharp) arrHideTime.unshift(0.25);
  for(var i=0;i<len;i++){  var tTmp=arrHideTime[i], str=getSuitableTimeUnitStr(tTmp); if(tTmp==intMax) str='∞';  var opt=createElement('option').myText(str).prop('value',tTmp);   el.append(opt);    } 

  return el;
}

var viewFrontCreator=function(){
  var el=createElement('div');
  var setupButtsBasedOnTDiff=function(){
    var tDiff=el.tHide-getTUnix();
    var boShow=tDiff>0;
    if(tDiff<=0) {tDiff=0;}
    var str, tmpS, tmpH, boDis, strDiff=getSuitableTimeUnitStr(tDiff);
    //if(boShow) {       str=strDiff; tmpS='#0f0'; tmpH=colGray;   boDis=true;     }else {       str=langHtml.On; tmpS=colGray; tmpH='#f00';  boDis=false;   }
    if(boShow) {       str=el.selHideTimer.valN()==intMax?'∞':strDiff; tmpS='#0f0'; tmpH=colGray;   boDis=true;     }else {       str=langHtml.On; tmpS=colGray; tmpH='#f00';  boDis=false;   }
    buttOn.myText(str).css('background-color', tmpS); buttOff.css('background-color', tmpH);
    viewManage.buttonAdd.prop("disabled", boShow);
    //viewTable.Row.forEach(ele=>ele.querySelector('[name=cbEnable]').prop("disabled", boShow));
    //viewTable.Row.forEach(ele=>ele.querySelector('[name=buttonEdit]').prop("disabled", boShow));
    //viewTable.Row.forEach(ele=>ele.querySelector('[name=buttonDelete]').prop("disabled", boShow));
    viewTable.Row.forEach(ele=>{
      ele.querySelector('[name=buttonConnect]').prop("disabled", boShow).css({opacity:boShow?0.4:1});
    });  //; .toggle(!boShow))
    viewTable.imgHelpHead.toggle(!boShow);
    buttonSetting.prop("disabled", boShow).css({opacity:boShow?0.4:1}); //buttonSetting.querySelector('img').css({opacity:boShow?0.4:1});
    buttonManage.prop("disabled", boShow).css({opacity:boShow?0.4:1});
    //buttonSetting.toggle(boShow);
  }
  el.setUp=function(objPref){
    var {tHide,hideTimer}=objPref;
    el.tHide=tHide;
    var tDiff=tHide-getTUnix();
    setupButtsBasedOnTDiff();
    if(tDiff>0) el.startNewTic(tDiff);
    el.selHideTimer.loadTimer(hideTimer);
  }
  
  el.startNewTic=function(tDiff){ 
    var tSleep=SuitableTimeUnit_getNextTick(tDiff);
    console.log("tDiff: "+tDiff+", tSleep: "+tSleep ); timerVar=setTimeout(cbTic, tSleep*1000);
  }
  el.stopTic=function(){ timerVar=clearTimeout(timerVar);}
  var cbTic=function(){
    var tDiff=el.tHide-getTUnix();
    if(tDiff<0) {  el.stopTic(); } else { el.startNewTic(tDiff); }
    setupButtsBasedOnTDiff();
  }

  var timerVar;
  el.tHide=0;
  
    // menuA
  var buttonManage=createElement('button').myAppend('Manage List').addClass('imageButton', 'fixWidth').css({'margin-left':'0.7em', 'margin-right':'0.3em', padding:'0.1em', 'background-color':colGray}).on('click', function(){
    doHistPush({view:viewManage});
    viewManage.setVis();
  });
  var buttonSetting=createElement('button').myAppend(charSetting).addClass('imageButton', 'fixWidth').css({'margin-left':'0.6em', 'margin-right':'0.3em', padding:'0.1em', 'background-color':colGray}).on('click', function(){
    doHistPush({view:viewSetting});
    viewSetting.setVis();
  }); //, 'font-weight':'bold'

  el.selHideTimer=selHideTimerCreator(); el.selHideTimer.css({width:'4em'});
  
  el.cbButtOnFin=function(){  // Finalizing "on"-click, This function is also called from Android native (in permission callback)
    var tUnix=getTUnix(), tDiff=el.selHideTimer.valN(); el.tHide=tUnix+tDiff; setupButtsBasedOnTDiff(); 
    timerVar=clearTimeout(timerVar); el.startNewTic(tDiff); 
  }
  var buttOn=createElement('button').myText(langHtml.On).css({'margin-left':'0.9em', padding:'0.3em'}).on('click', function(){  
    if(viewTable.Row.length==0) { setMess('List is empty',5); return; }
    var boAny=0; viewTable.Row.forEach(ele=>{if(ele.persistData.boEnable==1) {boAny=1; return;}});      if(boAny==0) { setMess('No enabled entries',5); return;}
    if(boNativeAndroid){
      var strRet=Android.startBGWork(); var {boFineOK, boBGOK}=JSON.parse(strRet);
      if(!boFineOK) { setMess('No location permission',5); return;}
      if(!boBGOK) { setMess('No background permission',5); return;}
      var str='Starting ...'; viewTable.setAllMess(str); setMess(str);
    } else{
      viewTable.setAllMess('Getting position ...');
      if(boGeoDenied) viewTable.sendAllOn({coords:{latitude:0,longitude:1}});
      else navigator.geolocation.getCurrentPosition(viewTable.sendAllOn, geoError, {timeout:10000});
      setItems();
    }
    el.cbButtOnFin();
  });
  var buttOff=createElement('button').myText(langHtml.Off).css({'margin-left':'0.9em', padding:'0.2em'}).on('click', function(){ 
    el.tHide=0; el.stopTic(); setupButtsBasedOnTDiff();
    if(boNativeAndroid){
      var str='Hidding ...'; viewTable.setAllMess(str); setMess(str); Android.stopBGWork();
    }else{
      viewTable.setAllMess('Sending ...');
      viewTable.sendAllOff();
      setItems();
    }
  });
  
  var buttCheckStat=createElement('button').myAppend("Check").addClass('imageButton', 'fixWidth').css({'margin-left':'1em', padding:'0.1em', 'background-color':colGray, color:'black'}).on('click', function(){  
    if(boNativeAndroid){
      var str='Checking ...'; viewTable.setAllMess(str); setMess(str); Android.check();
    } else{
      viewTable.setAllMess('Checking status ...');
      viewTable.sendAllCheck();
    }
  });  //, 'font-weight':'bold' //charCheck 
  
  var imgH=imgHelp.cloneNode(1).css({'margin-left':'1em'});   popupHover(imgH, createElement('div').myText('Set the timer and click "ON"'));


  buttonManage.css({'margin-left':'auto'})
  var menuA=createElement('div').myAppend(el.selHideTimer, buttOn, buttOff, buttCheckStat, buttonManage).css({padding:'0em', 'margin-top':'1em', overflow:'hidden', 'max-width':menuMaxWidth+'px', 'text-align':'left', margin:'.5em auto .8em', display:'flex', 'align-items':'center'}); //, imgH
  if(boNativeAndroid|| boDbg) menuA.append(buttonSetting); // || boDbg

  el.footerDiv=createElement('div').myAppend( menuA).css(cssFixed); //menuAA,

  el.append(el.footerDiv);
  return el;
}



var viewManageCreator=function(){
  var el=createElement('div')
  var buttonBack=createElement('button').myText(charBackSymbol).css({'margin-left':'0.6em', 'margin-right':'1em', padding:'0.4em'}).on('click', doHistBack);
  el.buttonAdd=createElement('button').myText('Add').prop({strType:'add'}).css({'margin-left':'0.8em', 'margin-right':'1em'}).on('click', function(){
    viewAddPop.openFunc();
  });
  var spanLabel=createElement('span').myText('Add/remove URIs').css({'float':'right', margin:'0.2em 0 0 0'});
  var menuA=createElement('div').myAppend(buttonBack, el.buttonAdd, spanLabel).css({padding:'0em', 'margin-top':'1em', overflow:'hidden', 'max-width':menuMaxWidth+'px', 'text-align':'left', margin:'.5em auto .8em'});
  el.footerDiv=createElement('div').myAppend(menuA).css(cssFixed);

  el.append(el.footerDiv);
  return el;
}



var viewSettingCreator=function(){
  var el=createElement('div');
  var populateSelect=function(){
    for(var i=0;i<arrSecond.length;i++){  
      var str=getSuitableTimeUnitStr(arrSecond[i]), opt=createElement('option').myText(str).prop('value',arrSecond[i]);
      el.selUpdate.append(opt);
      el.selFastestUpdate.append(opt.cloneNode(1));
    } 
    
    var KeyT=Object.keys(EnumAccuracy),  ValT=Object.values(EnumAccuracy);
    for(var i=0;i<ValT.length;i++){  var opt=createElement('option').myText(KeyT[i]).prop('value',ValT[i]);   el.selAccuracy.append(opt);    } 

  }
  el.setUp=function(objPref){ 
    var {boActiveTriggering, intAccuracy, tInterval, tFastestInterval, floatSmallestDisplacement}=objPref
    el.checkboxActiveTriggering.prop({checked:boActiveTriggering});
    el.selAccuracy.value=intAccuracy;
    var [bestVal]=closest2Val(arrSecond, tInterval); el.selUpdate.value=bestVal;
    var [bestVal]=closest2Val(arrSecond, tFastestInterval); el.selFastestUpdate.value=bestVal;
    el.inpSmallestDisplacement.value=floatSmallestDisplacement;
    el.selUpdate.prop({disabled:!boActiveTriggering});  el.selAccuracy.prop({disabled:!boActiveTriggering});
  }
  var save=function(){
    if(boNativeAndroid) {
      var intT=Number(el.inpSmallestDisplacement.value); if(isNaN(intT)) intT=0; intT=bound(intT,0,intMaxDisplacment);
      var boTmp=el.checkboxActiveTriggering.prop('checked');
      Android.setSetting(boTmp, Number(el.selAccuracy.value), Number(el.selUpdate.value), Number(el.selFastestUpdate.value), intT);
    } else setItems();
  }

    // ActiveTriggering
  var strHelp=`<p><b>Summary:</b></p>
  <p>Acquiring the location is (especially when using GPS) somewhat power hungry and may drain the battery.</p>
  <p>The Android OS however allows an app to piggyback other apps that have requested the location.</p>`;
  var imgH=imgHelp.cloneNode(1).css({'margin-right':'auto'});   popupHover(imgH, createElement('div').myHtml(strHelp), 30);
  var headActiveTriggering=createElement('h4').myAppend('Active location requests', imgH);

  el.checkboxActiveTriggering=createElement('input').prop({type:'checkbox'}).css({zoom:'1.5'}).on('click',function(){
    var boOn=this.prop('checked');
    el.selUpdate.prop({disabled:!boOn});  el.selAccuracy.prop({disabled:!boOn});
  });
  var pActiveTriggering=createElement('p').myAppend(langHtml.ActiveTriggering, el.checkboxActiveTriggering);

  var strHelp=
`<p><b>City-level:</b> The app will settle with city-level (cell-tower) accuracy. If cell-towers aren't found then more accurate methods (Wifi/GPS) are used.</p>
<p><b>Block-level:</b> The app will settle with block-level (wifi) accuracy. If Wifi-networks aren't found then GPS is used.</p>
<p><b>GPS:</b> The app won't settle with anything but the best (GPS if available). Note! resolving to GPS requires relatively much power.</p>`;
  var imgH=imgHelp.cloneNode(1).css({'margin-right':'auto'});   popupHover(imgH, createElement('div').myHtml(strHelp), 30);
  //var aInfo=createElement('a').prop({href:'https://info.closeby.market/backgroundLocationBroadcasterWeb_settings'}).myText('more info').css({'margin-left':'0.4em', 'margin-right':'auto'});
  
  el.selAccuracy=createElement('select');//.on('change', function(){ if(boNativeAndroid) Android.setAccuracy(Number(this.value)); else setItems();});
  var pAccuracy=createElement('p').myAppend(langHtml.Accuracy, imgH, el.selAccuracy);
  
  var arrSecond=[5,10,20,60,2*60,5*60,10*60,20*60,3600,2*3600,6*3600,12*3600,24*3600]; //
  //var arrSecondMS=Array(arrSecond.length); arrSecond.forEach((it,i)=>{arrSecondMS[i]=arrSecond[i]*1000;});
  
  var strHelp=`<p><b>Update interval:</b> Time limit after which the app <b>itself</b> triggers a location update</p>`;
  var imgH=imgHelp.cloneNode(1).css({'margin-right':'auto'});   popupHover(imgH, createElement('div').myHtml(strHelp), 10);
  el.selUpdate=createElement('select').on('change', function(){
    var v=Number(this.value); if(v<Number(el.selFastestUpdate.value)) el.selFastestUpdate.value=v;
    //if(boNativeAndroid) Android.setTInterval(v); else setItems();
  });
  var pUpdate=createElement('p').myAppend(langHtml.UpdateInterval, imgH, el.selUpdate);


    // NetWorkSave
  var headNetWorkSave=createElement('h4').myText('Saving bandwidth');
  var strHelp=`<p><b>Fastest update interval:</b> If other apps triggers location updates in a high pace, then this setting prevents them to come too often.</p>`
  var imgH=imgHelp.cloneNode(1).css({'margin-right':'auto'});   popupHover(imgH, createElement('div').myHtml(strHelp), 10);
  el.selFastestUpdate=createElement('select').on('change', function(){ 
    var v=Number(this.value); if(v>Number(el.selUpdate.value)) el.selUpdate.value=v;
    //if(boNativeAndroid) Android.setTFastestInterval(v); else setItems();
  });
  var pFastestUpdate=createElement('p').myAppend(langHtml.FastestUpdateInterval, imgH, el.selFastestUpdate);
  
  populateSelect();

  var strHelp=`Skipping updates if you have moved less than this distance.`, intMaxDisplacment=20000;
  var imgH=imgHelp.cloneNode(1).css({'margin-right':'auto'});   popupHover(imgH, createElement('div').myText(strHelp), 10);
  el.inpSmallestDisplacement=createElement('input').prop({type:'number', step:1, min:0, max:intMaxDisplacment});//.on('change', function(){ if(boNativeAndroid) Android.setSmallestDisplacement(Number(this.value)); else setItems();});
  var labSmallestDisplacement=createElement('label').myText(langHtml.SmallestDisplacement);
  var pSmallestDisplacement=createElement('p').myAppend(labSmallestDisplacement, imgH, el.inpSmallestDisplacement);


  var RowActiveTriggering=[pActiveTriggering, pAccuracy, pUpdate];
  var RowNetWorkSave=[ pFastestUpdate, pSmallestDisplacement];
  RowActiveTriggering.concat(...RowNetWorkSave).forEach(ele=>{   ele.css({display:'flex', 'justify-content': 'space-between', 'align-items':'center', margin:'0.3em auto', 'max-width':menuMaxWidth+'px'});   });
  var cssTmp={    background:'lightgrey', 'max-width':'500px', margin:'0.3em auto'};
  var divAcitiveTriggering=createElement('div').myAppend(headActiveTriggering, ...RowActiveTriggering).css(cssTmp);
  var divNetWorkSave=createElement('div').myAppend(headNetWorkSave, ...RowNetWorkSave).css(cssTmp);

  var buttonBack=createElement('button').myText(charBackSymbol).css({'margin-left':'0.6em', 'margin-right':'1em', padding:'0.4em'}).on('click', doHistBack);
  var buttonSave=createElement('button').myText('Save').css({'margin-left':'0.6em', 'margin-right':'1em', padding:'0.4em'}).on('click', save);
  var spanLabel=createElement('span').myText('Settings').css({margin:'0.2em 0 0 auto'}); //'float':'right', 
  var menuA=createElement('div').myAppend(buttonBack, buttonSave, spanLabel).css({display:'flex', 'justify-content': 'space-between', 'align-items':'center', padding:'0em', 'margin-top':'1em', overflow:'hidden', 'max-width':menuMaxWidth+'px', 'text-align':'left', margin:'.5em auto .8em'});
  el.footerDiv=createElement('div').myAppend(menuA).css(cssFixed);

  el.append(divAcitiveTriggering, divNetWorkSave, el.footerDiv);
  
  return el;
}

//app.errFunc=function(data){ resetMess(10);  }
app.geoError=function(errObj) {
  var str='';
  var type='str';
  if(typeof errObj == 'string') str=errObj;
  else {
    if(errObj.code==errObj.PERMISSION_DENIED){
      type='PERMISSION_DENIED';
      str="geoLocation: PERMISSION_DENIED";
    }else if(errObj.code==errObj.POSITION_UNAVAILABLE){
      type='POSITION_UNAVAILABLE';
      str="getCurrentPosition failed: "+type+', '+errObj.message;
    }else if(errObj.code==errObj.TIMEOUT){
      type='TIMEOUT';
      str="getCurrentPosition failed: "+type+', '+errObj.message;
    } 
    //boGeoOK=false; setItem('boGeoOK', boGeoOK);
    
  }
  var strB='';  
  //if(boFF && type!='PERMISSION_DENIED') strB=', Firefox might need Wifi to be on'; //langHtml.worksBetterWithWifi;
  //if(boOpera && type!='PERMISSION_DENIED') strB=', Opera might need Wifi to be on';
  if(boTouch && type=='POSITION_UNAVAILABLE') strB=', Android: check that sharing of wifi-positioning / gps is enabled. Do this under "Settings->Location Services"';
  //if(boTouch && type=='TIMEOUT' && !boAndroid) strB=', Android: Geolocation stops working every once in a while (A bug). Try reboot the device.';
  if(boTouch && type=='TIMEOUT' && boAndroid) {strB='Android: To use your exact location you have to reboot your device. Read more in the FAQ.'; };

  setMess(str+' '+strB);
}



var parsedHash = new URLSearchParams( window.location.hash.substr(1)  );  // skip the first char (#)
app.boDbg=Number(parsedHash.get('boDbg')); 
console.log("boDbg="+boDbg);

app.boNativeAndroid=typeof Android!='undefined'; app.boWebApp=!boNativeAndroid;

var objTmp
if(boNativeAndroid) { try{objTmp=JSON.parse(Android.getConstants());} catch(e){console.log(e);}}
else{  objTmp={EnumAccuracy:{HIGH_ACCURACY:0,b:1,c:2},API:0}; }
var {EnumAccuracy, API}=objTmp;
app.objPrefDefault={hideTimer:15, tHide:0, boActiveTriggering:true, intAccuracy:EnumAccuracy.HIGH_ACCURACY, tInterval:60, tFastestInterval:60, floatSmallestDisplacement:0.0};
app.boBGAPI=API>=29;

app.langHtml={
On:'On',
Off:'Off',
Back:'⇦',
addPopHead:'Add new entry',
editPopHead:'Edit entry',
Clear:'Clear',
SelectAll:'Select all',
Cancel:'Cancel',
Save:'Save',
Enable:'Enable',
ActiveTriggering:'Actively ask the device for the location',
Accuracy:'Accuracy',
UpdateInterval:'Update Interval',
FastestUpdateInterval:'Fastest Update Interval',
SmallestDisplacement:'Smallest Displacement [meters]',
OK:'OK',
delete:{head:"Delete"},

  // time units [[singularShort, pluralShort], [singularLong, pluralLong]]
timeUnit:{
s:[['s','s'],['second','seconds']],
m:[['min','min'],['minute','minutes']],
h:[['h','h'],['hour','hours']],
d:[['d','d'],['day','days']],
M:[['mo','mo'],['month','months']],
y:[['y','y'],['year','years']]
},
};




var cssFixed={margin:'0em 0', 'text-align':'center', position:'fixed', bottom:0, width:'100%', 'border-top':'3px #aaa solid', background:'#fff', 'z-index':5};
var sizeIcon=1.5, strSizeIconEm=sizeIcon+'em';
var menuMaxWidth=500;

//uintMax=1024*1024*1024*4-1;
var uintMax=Math.pow(2,32)-1;
var intMax=Math.pow(2,31)-1;
 

//if(location.hostname!='localhost' && location.protocol=='http:') {location.replace('https://'+location.hostname+location.pathname);  return;}
//alert('https: should be used (Sorry no automatic rewrite)');

app.elHtml=document.documentElement;  app.elBody=document.body;
elBody.css({margin:'0px', 'overscroll-behavior':'none'});

app.boTouch = Boolean('ontouchstart' in document.documentElement);  //boTouch=1;

var ua=navigator.userAgent, uaLC = ua.toLowerCase(); //alert(ua);
app.boAndroid = uaLC.indexOf("android") > -1;
app.boFF = uaLC.indexOf("firefox") > -1; 
//boIE = uaLC.indexOf("msie") > -1; 
var versionIE=detectIE();
app.boIE=versionIE>0; if(boIE) browser.brand='msie';

app.boChrome= /chrome/i.test(uaLC);
app.boIOS= /iPhone|iPad|iPod/i.test(uaLC);
app.boEpiphany=/epiphany/.test(uaLC);    if(boEpiphany && !boAndroid) boTouch=false;  // Ugly workaround

app.boOpera=RegExp('OPR\\/').test(ua); if(boOpera) boChrome=false; //alert(ua);

if(boTouch){
  if(boIOS) {
    var tmp={"-webkit-overflow-scrolling":"touch", "overflow":"hidden", height:'100%', overflow:'hidden'};
    elBody.css(tmp);  elHtml.css(tmp);
  } 
}

var boHistPushOK='pushState' in history;
if(!boHistPushOK) { alert('This browser does not support history'); return;}
var boStateInHistory='state' in history;
if(!boStateInHistory) { alert('This browser does not support history.state'); return;}

var tmp=rtrim(location.pathname, '/');
//if(tmp=='/index.html') tmp='';
tmp=tmp.replace(/\/index.html$/,'')
if(tmp.length) tmp+='/';
var flImageFolder=tmp+'lib/image';
//var wWorker=tmp+'worker.js';

var uCanonical=location.origin+location.pathname;  
  // I want to get rid of trailing slashes ...
  // However "Github pages" makes automatic rewrites to keep trailing slashes, so better keep them there  
if(location.hostname=='localhost'){
  uCanonical=rtrim(uCanonical, '/');
}


var fleImageFolder=flImageFolder+'/';
var flImCloseW=fleImageFolder+'triangleRightW.png';
var flImOpenW=fleImageFolder+'triangleDownW.png';
var flImCloseB=fleImageFolder+'triangleRight.png';
var flImOpenB=fleImageFolder+'triangleDown.png';
var flBusy=fleImageFolder+'busy.gif',  flHelpFile=fleImageFolder+'help.png';
var flVipp0=fleImageFolder+'vipp0.png',  flVipp1=fleImageFolder+'vipp1.png';

var flDelete=fleImageFolder+'delete.png';
var flDelete1=fleImageFolder+'delete1.png';
var flLink=fleImageFolder+'link.png';
var flLinkBroken=fleImageFolder+'linkBroken.png';
var flLinkC=fleImageFolder+'linkC.png';
var flLinkBrokenC=fleImageFolder+'linkBrokenC.png';
var flKeyEmpty=fleImageFolder+'keyEmpty.png';
var flKey=fleImageFolder+'key.png';
var flLockRed=fleImageFolder+'lockred.png';
var flLockOpen=fleImageFolder+'lockopen.png';
var flSetting=fleImageFolder+'setting1.png';
var flRerun=fleImageFolder+'rerun.png';

var uWiki='https://gavott.com/backgroundLocationBroadcasterWeb';
var uListOfValidSites='https://gavott.com/backgroundLocationBroadcaster_ListOfValidSites';

var colGray='#eee';


var charCheck=boAndroid?'🔃':'↻⟳'
var charCheck='↻'  //⟳
var charBackSymbol=boIOS?'◄':'◀';  // ⇦
var charSetting="⚙";  //🔧
  
//var imgHelp=createElement('img').prop({src:flHelpFile}).css({'vertical-align':'-0.4em'});
app.hovHelpMy=createElement('span').myText('❓').addClass('btn-round', 'helpButtonGradient').css({'margin-left':'0.6em'}).css({color:'transparent', 'text-shadow':'0 0 0 #5780a8'});
app.imgHelp=hovHelpMy;

var imgProt=createElement('img').prop({src:flKeyEmpty}).css({height:strSizeIconEm, width:strSizeIconEm, 'vertical-align':'text-bottom'}); 


var strHistTitle='control'; //wwwSite;
var histList=[];
var stateLoaded=history.state;
var tmpi=stateLoaded?stateLoaded.ind:0,    stateLoadedNew={hash:randomHash(), ind:tmpi};
history.replaceState(stateLoadedNew, '', uCanonical);
var stateTrans=stateLoadedNew;
history.StateMy=[];

window.on('popstate', function(event) {
  var dir=history.state.ind-stateTrans.ind;
  var boSameHash=history.state.hash==stateTrans.hash;
  if(boSameHash){
    var tmpObj=history.state;
    if('boResetHashCurrent' in history && history.boResetHashCurrent) {
      tmpObj.hash=randomHash();
      history.replaceState(tmpObj, '', uCanonical);
      history.boResetHashCurrent=false;
    }


    var stateMy=history.StateMy[history.state.ind];
    if(typeof stateMy!='object' ) {var tmpStr=window.location.href +" Error: typeof stateMy: "+(typeof stateMy); alert(tmpStr); return; }
    var view=stateMy.view;
    view.setVis();
    if(typeof view.getScroll=='function') {
      var scrollT=view.getScroll();
      setTimeout(function(){window.scrollTop(scrollT);}, 1);
    } else {
      //var scrollT=stateMy.scroll;  setTimeout(function(){  window.scrollTop(scrollT);}, 1);
    }
    

    if('funOverRule' in history && history.funOverRule) {history.funOverRule(); history.funOverRule=null;}
    else{
      if('fun' in stateMy && stateMy.fun) {var fun=stateMy.fun(stateMy); }
    }

    stateTrans=extend({}, tmpObj);
  }else{
    stateTrans=history.state; extend(stateTrans, {hash:randomHash()}); history.replaceState(stateTrans, '', uCanonical);
    history.go(sign(dir));
  }
}); 

if(boFF){
  window.on('beforeunload', function(){   });
} 


var strTmpEvent=boIOS?'unload':'beforeunload';  //  Safari mobile and Opera does not support the onbeforeunload-event (I think (Should be checked (maybe things have changed)))
//window.on(strTmpEvent, function(){setItems();});



var imgBusy=createElement('img').prop({src:flBusy});
//var spanMessageText=spanMessageTextCreate();  window.setMess=spanMessageText.setMess;  window.resetMess=spanMessageText.resetMess;  window.appendMess=spanMessageText.appendMess;  elBody.append(spanMessageText)

var divMessageText=divMessageTextCreate();  copySome(window, divMessageText, ['setMess', 'resetMess', 'appendMess']);
var divMessageTextW=createElement('div').myAppend(divMessageText).css({width:'100%', position:'fixed', bottom:'0px', left:'0px', 'z-index':'10'});
elBody.append(divMessageTextW);



var boSharp=!(location.hostname=='localhost' || location.hostname=='192.168.0.4');


var viewAddPop=viewAddPopCreator();
var viewEditPop=viewEditPopCreator();
var viewDeleteUriPopup=viewDeleteUriPopupCreator();
app.viewPermissionPop=viewPermissionPopCreator();

app.viewTable=viewTableCreator().css({margin:'0px auto', 'max-width':menuMaxWidth+'px'});

app.viewFront=viewFrontCreator();
var viewManage=viewManageCreator(); 
var viewSetting=viewSettingCreator();


history.StateMy[history.state.ind]={view:viewFront};


//var StrMainDiv=['table', 'front', 'manage', 'sort', 'setting', 'addPop', 'editPop', 'deleteUriPopup', 'storeKeyPopup'];  
//var MainDiv=[];
//for(var i=0;i<StrMainDiv.length;i++){ var key='view'+ucfirst(StrMainDiv[i]); MainDiv.push(window[key]); }

var MainDiv=[viewTable, viewFront, viewManage, viewAddPop, viewEditPop, viewDeleteUriPopup, viewPermissionPop, viewSetting]; //, viewStoreKeyPopup


MainDiv.forEach(ele=>ele.hide());
elBody.append(...MainDiv);



viewFront.setVis=function(){
  MainDiv.forEach(ele=>ele.hide()); this.show(); viewTable.show();
  viewTable.setType('main');
  viewTable.css({'margin-bottom':50+'px'});
  return true;
}
viewManage.setVis=function(){
  MainDiv.forEach(ele=>ele.hide()); this.show(); viewTable.show();
  viewTable.setType('manage');
  viewTable.css({'margin-bottom':50+'px'});
  return true;
}
viewSetting.setVis=function(){
  MainDiv.forEach(ele=>ele.hide()); this.show();
  return true;
}





var storagedData_serialize=function(MTab, objPref){
  var strMTab=JSON.stringify(MTab),    strA=JSON.stringify(objPref);
  return strA+'\n'+strMTab;
}
var storagedData_deserialize=function(str){
  var Line=str.split('\n'), lineA=Line[0], lineUrl=Line.slice(1);
  var objPref=JSON.parse(lineA);
  var MTab=JSON.parse(lineUrl);
  return {MTab, objPref};
}


var getItems=function(){
  var str, obj; if(boNativeAndroid) str=Android.readPref(); else str=getItem('backgroundLocationBroadcasterWeb');
  if(str) {var obj=storagedData_deserialize(str);} //else obj={MTab:[], objPref:Object.assign({}, objPrefDefault)};
  return obj;
}
var setItems=function(){
  var MTab=viewTable.getData(), hideTimer=viewFront.selHideTimer.valN(), tHide=viewFront.tHide, boActiveTriggering=viewSetting.checkboxActiveTriggering.prop('checked'), intAccuracy=viewSetting.selAccuracy.value, tInterval=viewSetting.selUpdate.value, tFastestInterval=viewSetting.selFastestUpdate.value, floatSmallestDisplacement=viewSetting.inpSmallestDisplacement.value;
  var objPref={hideTimer, tHide, boActiveTriggering, intAccuracy, tInterval, tFastestInterval, floatSmallestDisplacement};
  var str=storagedData_serialize(MTab, objPref);
  //if(boNativeAndroid) Android.writePref(str); else setItem('backgroundLocationBroadcasterWeb', str);
  if(boNativeAndroid) ; else setItem('backgroundLocationBroadcasterWeb', str);
}

var objData=getItems(); if(objData==undefined) objData={MTab:[], objPref:Object.assign({},objPrefDefault)};


   // Incase the preferences has changed: Use the default pref and only use old prefs with equal name.
var objPrefN=Object.assign({},objPrefDefault);
var KeyO=Object.keys(objData.objPref), KeyN=Object.keys(objPrefN);
KeyN.forEach(keyN=>{
  var iO=KeyO.indexOf(keyN); if(iO!=-1) objPrefN[keyN]=objData.objPref[KeyO[iO]];
});
objData.objPref=objPrefN;

//Object.assign(objPrefN, objData.objPref); // this makes sure new properties are included
viewTable.setUp(objData.MTab);
viewFront.setUp(objData.objPref);
viewSetting.setUp(objData.objPref);

viewFront.show().setVis();

if(boWebApp) navigator.permissions.query({ name: 'geolocation'}).then(permission => app.boGeoDenied=permission.state=='denied');

if(boNativeAndroid) { 
  var objTmp
  try{objTmp=JSON.parse(Android.getPermission());} catch(e){console.log(e);}
  var {boFineOK, boBGOK}=objTmp;
  window.viewPermissionPop.setUpAllowBut(boFineOK, boBGOK);
}

// kotlin List splice

}
