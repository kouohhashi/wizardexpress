/**
 * wizarexpress.js
 * Wizrd Express Team
 * session.js is freely distributable under the MIT license.
 */

'use strict';

//
// helper functions
//

// generate random string
var random_string = function(max_number){
    if (!max_number){
      max_number = 5;
    }
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < max_number; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

// Extend String
String.prototype.replaceAll = function(org, dest){
  return this.split(org).join(dest);
}

// tracking events
var tracking_events = [
  'resize',
  'scroll',
  'mouseenter',
  'mouseover',
  'mousemove',
  'mousedown',
  'mouseup',
  'auxclick',
  'click',
  'dblclick',
  'contextmenu',
  'wheel',
  'mouseleave',
  'mouseout',
  'select',
  'pointerlockchange',
  'pointerlockerror'
];

// timer
var wizard_timer = null;



// our module
module.exports = {
  'foo':'bar',
  'initWithAPI':function(api_key){
    // init browser_id and session_id

    // set api key
    module.exports.api_key = api_key;

    // browser_id
    if (!module.exports.browser_id){

      // If the browser_id hasn't already been set...
      if (document.cookie.indexOf('we_browser_id_set=1') == -1) {

         // browser_id
         var browser_id = random_string(8)+parseInt(new Date().getTime()).toString(36);
         module.exports.browser_id = browser_id;

         // set cookies
         document.cookie = "we_browser_id="+browser_id+"; expires=Fri, 01 Jan 2100 12:00:00 UTC; domain=."+location.hostname+"; path=/";
         document.cookie = 'we_browser_id_set=1; expires=Fri, 01 Jan 2100 12:00:00 UTC; domain=."+location.hostname+"; path=/';

      } else {

        c_arr1 = document.cookie.split(";");
        for (var i=0; i<c_arr1.length; i++) {

          if (c_arr1[i].trim().indexOf("we_browser_id=") != -1) {
            c_arr2 = c_arr1[i].trim().split("=");
            browser_id = c_arr2[1];
            module.exports.browser_id = browser_id;
          }
        }
      }
    }

    // session id
    if (!module.exports.session_id){

      // If the browser_id hasn't already been set...
      if (document.cookie.indexOf('we_session_id_set=1') == -1) {

         // session_id
         var session_id = random_string(8)+parseInt(new Date().getTime()).toString(36);
         module.exports.session_id = session_id;

         // var expires = new Date()
         var expires = new Date(new Date().getTime() + 10 * 60 * 1000);
         // set cookies
         document.cookie = "we_session_id="+session_id+"; expires="+expires.toUTCString()+"; domain=."+location.hostname+"; path=/";
         document.cookie = 'we_session_id_set=1; expires="+expires.toUTCString()+"; domain=."+location.hostname+"; path=/';

      } else {

        c_arr1 = document.cookie.split(";");
        for (var i=0; i<c_arr1.length; i++) {

          if (c_arr1[i].trim().indexOf("we_session_id=") != -1) {
            c_arr2 = c_arr1[i].trim().split("=");
            session_id = c_arr2[1];
            module.exports.session_id = session_id;
          }
        }
      }
    }

    // set events
    var eventName = null;
    var prefix = null;

    for (var key in document) {
       prefix = key.substr(0, 2);
       if (prefix === "on") {
         eventName = key.substr(2);
         if (tracking_events.indexOf(eventName) != -1) {
           document.addEventListener(eventName, module.exports.doSomething, true);
         }
       }
    }

    // init log
    module.exports.action_log = [];

    // set timer
    if (wizard_timer){
      clearInterval(wizard_timer);
      wizard_timer = null;
    }

    console.log("-- wizard_timer 1");

    wizard_timer = setInterval(function(){

      // console.log("-- wizard_timer 2");
      if (!module.exports.action_log || module.exports.action_log.length == 0){
        return;
      }

      console.log("-- wizard_timer 3");

      var send_arr = module.exports.action_log.slice();
      module.exports.action_log = [];
      module.exports.send(send_arr, function(err, data){
        if (err){
          console.log(err);
          return;
        }


        var rand_value = Math.random();
        console.log("rand_value:"+rand_value);

        if (rand_value < 0.4) {
           module.exports.trigger('tick', new Date());
        }

      })
    }, 3000);

  },
  'doSomething':function(ev){
    // console.log(ev);

    // console.log(module.exports.action_log);
    if (!module.exports.action_log){
      module.exports.action_log = [];
    }

    var timestamp = new Date().getTime();

    var should_record = false;
    if (ev.type == "click" || ev.type == "scroll"){
      should_record = true;
    } else if ( !module.exports.last_action_timestamp || (timestamp - module.exports.last_action_timestamp) > 100 ) {
      should_record = true;
    }

    if ( should_record == true ) {

      // console.log(ev);

      var target = {};
      if (ev.target) {
        target = {
          'id':ev.target.id,
          'tagName':ev.target.tagName,
          'classList':ev.target.classList
        }
      }
      var toElement = {};
      if (ev.toElement && ev.toElement) {
        toElement = {
          'id':ev.toElement.id,
          'tagName':ev.toElement.tagName,
          'classList':ev.toElement.classList
        }
      }
      var fromElement = {};
      if (ev.fromElement && ev.fromElement) {
        fromElement = {
          'id':ev.fromElement.id,
          'tagName':ev.fromElement.tagName,
          'classList':ev.fromElement.classList
        }
      }

      var action = {}
      if (ev.type == "scroll"){

        action = {
          'type':ev.type,
          'timestamp':timestamp,
          'scrollTop':document.body.scrollTop,
          'scrollLeft':document.body.scrollTop,
          'offsetHeight':document.body.offsetHeight,
          'offsetWidth':document.body.offsetWidth,
          'scrollHeight':document.body.scrollHeight,
          'clientHeight':document.body.clientHeight,
          'element':'document.body'
        };
      } else {
        action = {
          'type':ev.type,
          'clientX':ev.clientX,
          'clientY':ev.clientX,
          'layerX':ev.layerX,
          'layerY':ev.layerY,
          'offsetX':ev.offsetX,
          'offsetY':ev.offsetY,
          'screenX':ev.screenX,
          'screenY':ev.screenY,
          'target':target,
          'toElement':toElement,
          'fromElement':fromElement,
          'x':ev.x,
          'y':ev.y,
          'timestamp':timestamp,
        }
      }

      module.exports.last_action_timestamp = timestamp;
      module.exports.action_log.push({
        'action':action,
        'window_location':window.location,
        //'browser_id':module.exports.browser_id,
        //'session_id':module.exports.session_id,
        'referrer':document.referrer
      });
    }

  },
  'send':function(action_log, cb){

    var xhr = new XMLHttpRequest();
    var url = "https://api.init.gifts/wizardexpress/test";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {

        if ( xhr.status === 200 ) {
          // console.log(xhr.responseText);
          var response_json = JSON.parse(xhr.responseText);
          if (response_json.result_code == "success"){
            cb(null, response_json);
          } else {
            cb(response_json.detail);
          }
        } else {
          cb("status:"+xhr.status);
        }
      }
    };
    var data = JSON.stringify({
      'behavior':action_log,
      'api_key':module.exports.api_key,
      // 'window_location':window.location,
      'browser_id':module.exports.browser_id,
      'session_id':module.exports.session_id,
      // 'referrer':document.referrer
    });
    if (module.exports.user_id) {
      data["user_id"] = module.exports.user_id
    }
    xhr.send(data);
  },
  bind	: function(event, fct){
    this._events = this._events || {};
    this._events[event] = this._events[event]	|| [];
    this._events[event].push(fct);
  },
  unbind	: function(event, fct){
    this._events = this._events || {};
    if( event in this._events === false  )	return;
    this._events[event].splice(this._events[event].indexOf(fct), 1);
  },
  trigger	: function(event /* , args... */){
    this._events = this._events || {};
    if( event in this._events === false  )	return;
    for(var i = 0; i < this._events[event].length; i++){
      this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
    }
  }
};
