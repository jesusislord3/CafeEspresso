(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["MyLibrary"] = factory();
	else
		root["MyLibrary"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = {
    pollScript(globalName, callback) {
        var pollInterval = 100; //ms
        var FbPoll = setInterval(function () { // check to see if the FB libray is loaded every 100 ms.
            var tries = 0;
            // if("FB" in window && "instagramfeed" in window){
            if (globalName in window) {
                clearTimeout(FbPoll);
                callback();
            }
            else {
                tries++
                if (tries === 10) {
                    console.log(10 + " attempts to load " + globalName + " bailing out.")
                    clearTimeout(FbPoll);
                }
            }
        }, pollInterval)
    }
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

var appConfig = {
    /**
     * Advanced logging
    */
    debug:true,
    getFacebook:false,
    getInstafeed:true
}

if(appConfig.debug){
    console.log("App Config:")
    console.log(JSON.stringify(appConfig, null, "\t"));
}

module.exports = appConfig;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var {pollScript} = __webpack_require__(0);
var appConfig = __webpack_require__(1);
__webpack_require__(3);


if(appConfig.getFacebook){
    pollScript("FB", __webpack_require__(4))
}

if(appConfig.getInstafeed){
    pollScript("Instafeed", __webpack_require__(6))
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var {pollScript} = __webpack_require__(0);
var configApp = __webpack_require__(1);

//App settings
var debug = configApp.debug;

//for ease of use I have setup template from the Global window object, call template() instead of Handlebars.template or window.Handlebars.template (same thing)
var template = window.Handlebars.template;


var access_token = '1d38bb6549a422b349b009f29697e4d2';
var fbpage = '156900194833233';
var endpoints = {
  //add your endpoints here as getters
  get feed(){
    return fbpage+"/feed";
  }
}



// What to load when document object model is loaded.
// 1 CREATE FB SCRIPT TAG DYNAMICLY TO START LOADING API - this allows FB init script to load EG.. initApp()
window.addEventListener("DOMContentLoaded",function(){

  //I am patching without a server so to ensure it runs in real life I will get the origin and fix the js src origin acordingly.
  var origin = location.origin === "file://" ? "https:":"";
  var lang = "en_US";

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = origin+"//connect.facebook.net/"+lang+"/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

   //now that the script tag is appended in the body lets run the callback bellow

})


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var facebookSettings = __webpack_require__(5);

module.exports = function(){
    console.log("Facebook loaded")
  //DO STUFF HERE
  FB.init(facebookSettings);
  FB.AppEvents.logPageView();

 // begin login .. beware popup blocker.
  FB.login(function(response) {
    if (response.authResponse) {
     console.log('Welcome!  Fetching your information.... ');
     FB.api('/me', function(response) {
       console.log('Good to see you, ' + response.name + '.');
     });
    } else {
     console.log('User cancelled login or did not fully authorize.');
    }
  });

  // check login status  - https://developers.facebook.com/docs/facebook-login/web#logindialog
  FB.getLoginStatus(function(response) {
    if(response.status === 'connected') {
      console.log(response.authResponse.accessToken);
    }
    console.log(response);
  });




  //helpful hints
  if(debug){
    console.log("Running in debug mode, see useful info bellow.")
    console.log("APP: ",JSON.stringify(Object.assign(
      facebookSettings,
      endpoints,
      {facebookPage: fbpage}
    ), null, "\t"))
  }

  //CALLS
  //returns an array of facebook "post" objects to "callback"
  FB.api( endpoints.feed,{access_token:'1b02d3c8312abb42be267cadd63570c5'}, fbsocialFeed );

  //DEFINE HELPERS
  function fbsocialFeed(callback) {
    FB.Event.subscribe('auth.authResponseChange', function(callback){
      console.log(callback);
    });
    FB.Event.subscribe('auth.statusChange', function(callback){
      console.log(callback);
    });


    //TEMPLATING
    $(callback).each(function (index, item) {
      if("error" in item){
        if(debug){
          console.log("FB Social has sent an error instead of a bunch of data! check your page id, app id, online status. what is stoping data?")
          console.log(callback);
        }
      }
      else{
        var fbSocialFeedContext = {
          message: item['message'],
          picture_src: item['from']['picture'],
          name: item['from']['first_name']
        }
        if(debug){ console.log( template(fbSocialFeedContext) ) }

        //template is defined at top of this script, see this for Handlebars details and how globals work.
        $("#fbsocial").append( template(fbSocialFeedContext) );//render a template from the index.html <body>
        }
    });
  }
  // begin instagram backup gallery
  // window.Instafeed = require("instafeed");
}

/***/ }),
/* 5 */
/***/ (function(module, exports) {

//Facebook config
module.exports = {
    appId            : '139288266642775', //TODO THIS APP ID IS WRONG
    autoLogAppEvents : true,
    status           : true,
    xfbml            : true,
    version          : 'v2.9' // or v2.8, v2.7, v2.6, v2.5, v2.4, v2.3,
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {


var instagramSettings = __webpack_require__(7);

module.exports = function(){
  console.log("loading instagram")
  var instagramfeed = new Instafeed(instagramSettings);
  
  instagramfeed.run();
}

/***/ }),
/* 7 */
/***/ (function(module, exports) {

//Instagram config
var instagramConfig = {
    get: 'location',
    locationId: '156900194833233',
    template : '<div class="col-md-3 container-fluid" id="image-{{id}}"><img src="{{picture}}" href="{{link}}"></div>',
    target : '#instagram-gallery',
    clientId: '1c1c48d30d694bfa8244cc994ba4dae8',
    accessToken:"6a307d2e5d7d44c8aac70c10d67e0777",
    error:(err)=>{
        console.log(instagramConfig)
        console.log("Instafeed:",new Error(err));
    },
    after(){
        console.log("Instagram loaded")
    }
}

module.exports = instagramConfig;

/***/ })
/******/ ]);
});
//# sourceMappingURL=bundle.js.map