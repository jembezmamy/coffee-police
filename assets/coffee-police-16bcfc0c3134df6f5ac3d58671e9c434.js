"use strict"
define("coffee-police/app",["exports","coffee-police/resolver","ember-load-initializers","coffee-police/config/environment"],function(e,t,n,r){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var o=Ember.Application.extend({modulePrefix:r.default.modulePrefix,podModulePrefix:r.default.podModulePrefix,Resolver:t.default});(0,n.default)(o,r.default.modulePrefix)
var i=o
e.default=i}),define("coffee-police/application/route",["exports"],function(e){function t(e,t,n,r,o,i,a){try{var c=e[i](a),l=c.value}catch(u){return void n(u)}c.done?t(l):Promise.resolve(l).then(r,o)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=Ember.Route.extend({dataCoordinator:Ember.inject.service(),beforeModel:function(){var e,n=(e=regeneratorRuntime.mark(function e(){var t,n
return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=this.dataCoordinator.getSource("backup"),e.next=3,t.pull(function(e){return e.findRecords()})
case 3:return n=e.sent,e.next=6,this.store.sync(n)
case 6:return e.next=8,this.dataCoordinator.activate()
case 8:case"end":return e.stop()}},e,this)}),function(){var n=this,r=arguments
return new Promise(function(o,i){var a=e.apply(n,r)
function c(e){t(a,o,i,c,l,"next",e)}function l(e){t(a,o,i,c,l,"throw",e)}c(void 0)})})
return function(){return n.apply(this,arguments)}}()})
e.default=n}),define("coffee-police/components/people-list/component",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.Component.extend({store:Ember.inject.service(),didInsertElement:function(){var e=this
this._super.apply(this,arguments),this.store.liveQuery(function(e){return e.findRecords("person")}).then(function(t){return e.set("people",t)})}})
e.default=t}),define("coffee-police/components/people-list/form/component",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.Component.extend({tagName:"form","data-test-person-form":!0,faceDetector:Ember.inject.service(),store:Ember.inject.service(),actions:{submit:function(){var e=this
this.faceDetector.detect().then(function(t){if(t[0])return e.store.addRecord({type:"person",name:e.name,image:t[0].image.toDataURL()})
throw"no face detected"}).then(function(){return e.set("name","")})}}})
e.default=t}),define("coffee-police/components/people-list/form/template",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.HTMLBars.template({id:"mNuParCs",block:'{"symbols":[],"statements":[[5,"input",[[12,"name","person[name]"]],[["@value"],[[22,"name"]]]],[0,"\\n"],[7,"input",false],[12,"value","Add person"],[12,"disabled",[28,"not",[[24,["name"]]],null]],[12,"type","submit"],[3,"action",[[23,0,[]],"submit"]],[8],[9],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"coffee-police/components/people-list/form/template.hbs"}})
e.default=t}),define("coffee-police/components/people-list/item/component",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.Component.extend({"data-test-person":!0,actions:{remove:function(){this.model.remove()}}})
e.default=t}),define("coffee-police/components/people-list/item/template",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.HTMLBars.template({id:"ux4Vm1uj",block:'{"symbols":[],"statements":[[7,"img",true],[11,"src",[24,["model","image"]]],[11,"class",[29,[[22,"styleNamespace"],"__image"]]],[11,"alt",[24,["model","name"]]],[8],[9],[0,"\\n\\n"],[1,[24,["model","name"]],false],[0,"\\n\\n"],[7,"button",false],[12,"name",[29,["removePerson[",[24,["model","id"]],"]"]]],[12,"type","button"],[3,"action",[[23,0,[]],"remove"]],[8],[0,"\\n  Remove\\n"],[9],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"coffee-police/components/people-list/item/template.hbs"}})
e.default=t}),define("coffee-police/components/people-list/template",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.HTMLBars.template({id:"iBCaW3JW",block:'{"symbols":["person"],"statements":[[5,"people-list/form",[],[[],[]]],[0,"\\n\\n"],[4,"each",[[24,["people"]]],null,{"statements":[[0,"  "],[5,"people-list/item",[],[["@model"],[[23,1,[]]]]],[0,"\\n"]],"parameters":[1]},null]],"hasEval":false}',meta:{moduleName:"coffee-police/components/people-list/template.hbs"}})
e.default=t}),define("coffee-police/components/person-detector/component",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.Component.extend({faceRanker:Ember.inject.service(),actions:{detect:function(){var e=this
this.setProperties({isDetecting:!0,didDetect:!1,results:null}),this.faceRanker.detect(1e3,3e3).then(function(t){return e.set("results",t&&t.length?t.slice(0,3):t)}).finally(function(){return e.setProperties({isDetecting:!1,didDetect:!0})})}}})
e.default=t}),define("coffee-police/components/person-detector/template",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.HTMLBars.template({id:"M6CDEjiS",block:'{"symbols":["person"],"statements":[[7,"button",false],[12,"name","detect"],[12,"disabled",[22,"isDetecting"]],[12,"type","button"],[3,"action",[[23,0,[]],"detect"]],[8],[0,"\\n  Detect!\\n"],[9],[0,"\\n\\n"],[4,"if",[[24,["results"]]],null,{"statements":[[4,"if",[[24,["results","length"]]],null,{"statements":[[0,"    Hi,\\n"],[4,"each",[[24,["results"]]],null,{"statements":[[0,"      "],[1,[23,1,["name"]],false],[0,",\\n"]],"parameters":[1]},null],[0,"    or someone else...?\\n"]],"parameters":[]},{"statements":[[0,"    Hi, "],[1,[24,["results","name"]],false],[0,"!\\n"]],"parameters":[]}]],"parameters":[]},{"statements":[[4,"if",[[24,["didDetect"]]],null,{"statements":[[0,"    Do we know each other...?\\n"]],"parameters":[]},null]],"parameters":[]}]],"hasEval":false}',meta:{moduleName:"coffee-police/components/person-detector/template.hbs"}})
e.default=t}),define("coffee-police/components/video-preview/box/component",["exports","coffee-police/utils/bem-states"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=Ember.Component.extend((0,t.default)("isConfident"),{attributeBindings:["style"],"data-test-box":!0,box:Ember.computed.reads("model.box"),style:Ember.computed("box.{left,top,width,height}",function(){var e=this
return["left","top","width","height"].map(function(t){return"".concat(t,": ").concat(e.get("box.".concat(t)),"px")}).join("; ").htmlSafe()}),isConfident:Ember.computed("model.confidentMatch",function(){return!!this.model.confidentMatch})})
e.default=n}),define("coffee-police/components/video-preview/box/template",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.HTMLBars.template({id:"SUfqFUck",block:'{"symbols":["&default"],"statements":[[14,1],[0,"\\n"],[1,[24,["model","confidentMatch","person","name"]],false],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"coffee-police/components/video-preview/box/template.hbs"}})
e.default=t}),define("coffee-police/components/video-preview/component",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.Component.extend({webcam:Ember.inject.service(),faceDetector:Ember.inject.service(),didInsertElement:function(){var e=this
this._super.apply(this,arguments),this.webcam.start().then(function(){return e.faceDetector.start()}).then(function(){return e.element.querySelector("video").srcObject=e.webcam.stream})}})
e.default=t}),define("coffee-police/components/video-preview/template",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.HTMLBars.template({id:"26w8wwjl",block:'{"symbols":["face"],"statements":[[7,"video",true],[10,"autoplay",""],[10,"muted",""],[8],[9],[0,"\\n\\n"],[4,"each",[[24,["faceDetector","faces"]]],null,{"statements":[[0,"  "],[1,[28,"video-preview/box",null,[["model"],[[23,1,[]]]]],false],[0,"\\n"]],"parameters":[1]},null]],"hasEval":false}',meta:{moduleName:"coffee-police/components/video-preview/template.hbs"}})
e.default=t}),define("coffee-police/data-models/person",["exports","ember-orbit"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=t.Model.extend({name:(0,t.attr)("string"),image:(0,t.attr)("string")})
e.default=n}),define("coffee-police/data-sources/backup",["exports","@orbit/indexeddb"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n={create:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{}
return e.name="backup",e.namespace="coffe-police",new t.default(e)}}
e.default=n}),define("coffee-police/data-strategies/store-backup-sync",["exports","@orbit/coordinator"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n={create:function(){return new t.SyncStrategy({name:"store-backup-sync",source:"store",target:"backup",blocking:!0})}}
e.default=n}),define("coffee-police/helpers/and",["exports","ember-truth-helpers/helpers/and"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"and",{enumerable:!0,get:function(){return t.and}})}),define("coffee-police/helpers/app-version",["exports","coffee-police/config/environment","ember-cli-app-version/utils/regexp"],function(e,t,n){function r(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},o=t.default.APP.version,i=r.versionOnly||r.hideSha,a=r.shaOnly||r.hideVersion,c=null
return i&&(r.showExtended&&(c=o.match(n.versionExtendedRegExp)),c||(c=o.match(n.versionRegExp))),a&&(c=o.match(n.shaRegExp)),c?c[0]:o}Object.defineProperty(e,"__esModule",{value:!0}),e.appVersion=r,e.default=void 0
var o=Ember.Helper.helper(r)
e.default=o}),define("coffee-police/helpers/eq",["exports","ember-truth-helpers/helpers/equal"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"equal",{enumerable:!0,get:function(){return t.equal}})}),define("coffee-police/helpers/gt",["exports","ember-truth-helpers/helpers/gt"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"gt",{enumerable:!0,get:function(){return t.gt}})}),define("coffee-police/helpers/gte",["exports","ember-truth-helpers/helpers/gte"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"gte",{enumerable:!0,get:function(){return t.gte}})}),define("coffee-police/helpers/is-array",["exports","ember-truth-helpers/helpers/is-array"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"isArray",{enumerable:!0,get:function(){return t.isArray}})}),define("coffee-police/helpers/is-empty",["exports","ember-truth-helpers/helpers/is-empty"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("coffee-police/helpers/is-equal",["exports","ember-truth-helpers/helpers/is-equal"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"isEqual",{enumerable:!0,get:function(){return t.isEqual}})}),define("coffee-police/helpers/lt",["exports","ember-truth-helpers/helpers/lt"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"lt",{enumerable:!0,get:function(){return t.lt}})}),define("coffee-police/helpers/lte",["exports","ember-truth-helpers/helpers/lte"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"lte",{enumerable:!0,get:function(){return t.lte}})}),define("coffee-police/helpers/not-eq",["exports","ember-truth-helpers/helpers/not-equal"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"notEq",{enumerable:!0,get:function(){return t.notEq}})}),define("coffee-police/helpers/not",["exports","ember-truth-helpers/helpers/not"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"not",{enumerable:!0,get:function(){return t.not}})}),define("coffee-police/helpers/or",["exports","ember-truth-helpers/helpers/or"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"or",{enumerable:!0,get:function(){return t.or}})})
define("coffee-police/helpers/pluralize",["exports","ember-inflector/lib/helpers/pluralize"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=t.default
e.default=n}),define("coffee-police/helpers/singularize",["exports","ember-inflector/lib/helpers/singularize"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=t.default
e.default=n}),define("coffee-police/helpers/xor",["exports","ember-truth-helpers/helpers/xor"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"xor",{enumerable:!0,get:function(){return t.xor}})}),define("coffee-police/index/template",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.HTMLBars.template({id:"nXpXl1Ft",block:'{"symbols":[],"statements":[[5,"video-preview",[],[[],[]]],[0,"\\n\\n"],[5,"person-detector",[],[[],[]]],[0,"\\n\\n"],[5,"people-list",[],[[],[]]],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"coffee-police/index/template.hbs"}})
e.default=t}),define("coffee-police/initializers/app-version",["exports","ember-cli-app-version/initializer-factory","coffee-police/config/environment"],function(e,t,n){var r,o
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,n.default.APP&&(r=n.default.APP.name,o=n.default.APP.version)
var i={name:"App Version",initialize:(0,t.default)(r,o)}
e.default=i}),define("coffee-police/initializers/component-styles",["exports","ember-component-css/initializers/component-styles","coffee-police/mixins/style-namespacing-extras"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"initialize",{enumerable:!0,get:function(){return t.initialize}}),Ember.Component.reopen(n.default)}),define("coffee-police/initializers/container-debug-adapter",["exports","ember-resolver/resolvers/classic/container-debug-adapter"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n={name:"container-debug-adapter",initialize:function(){var e=arguments[1]||arguments[0]
e.register("container-debug-adapter:main",t.default),e.inject("container-debug-adapter:main","namespace","application:main")}}
e.default=n}),define("coffee-police/initializers/ember-data",["exports","ember-data/setup-container","ember-data"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var r={name:"ember-data",initialize:t.default}
e.default=r}),define("coffee-police/initializers/ember-orbit-config",["exports","ember-orbit/initializers/ember-orbit-config"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"initialize",{enumerable:!0,get:function(){return t.initialize}})}),define("coffee-police/initializers/ember-orbit-services",["exports","ember-orbit/initializers/ember-orbit-services"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"initialize",{enumerable:!0,get:function(){return t.initialize}})}),define("coffee-police/initializers/export-application-global",["exports","coffee-police/config/environment"],function(e,t){function n(){var e=arguments[1]||arguments[0]
if(!1!==t.default.exportApplicationGlobal){var n
if("undefined"!=typeof window)n=window
else if("undefined"!=typeof global)n=global
else{if("undefined"==typeof self)return
n=self}var r,o=t.default.exportApplicationGlobal
r="string"==typeof o?o:Ember.String.classify(t.default.modulePrefix),n[r]||(n[r]=e,e.reopen({willDestroy:function(){this._super.apply(this,arguments),delete n[r]}}))}}Object.defineProperty(e,"__esModule",{value:!0}),e.initialize=n,e.default=void 0
var r={name:"export-application-global",initialize:n}
e.default=r}),define("coffee-police/instance-initializers/ember-data",["exports","ember-data/initialize-store-service"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n={name:"ember-data",initialize:t.default}
e.default=n}),define("coffee-police/instance-initializers/route-styles",["exports","ember-component-css/instance-initializers/route-styles"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"initialize",{enumerable:!0,get:function(){return t.initialize}})}),define("coffee-police/mixins/style-namespacing-extras",["exports","ember-component-css/mixins/style-namespacing-extras"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("coffee-police/resolver",["exports","ember-resolver"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=t.default
e.default=n}),define("coffee-police/router",["exports","coffee-police/config/environment"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=Ember.Router.extend({location:t.default.locationType,rootURL:t.default.rootURL})
n.map(function(){})
var r=n
e.default=r}),define("coffee-police/services/ajax",["exports","ember-ajax/services/ajax"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("coffee-police/services/face-detector",["exports","face-api.js","coffee-police/config/environment"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.Face=e.FaceMatcher=e.default=void 0
var r=Ember.ObjectProxy.extend(Ember.PromiseProxyMixin),o=Ember.Service.extend({webcam:Ember.inject.service(),store:Ember.inject.service(),FaceAPI:t.default,isReady:!1,isDetecting:!1,setup:function(){var e=this
return this.loadPromise=this.loadPromise||Ember.RSVP.all(["ssdMobilenetv1","faceRecognitionNet","faceLandmark68Net"].map(function(t){return e.FaceAPI.nets[t].loadFromUri("".concat(n.default.rootURL,"models"))})).then(function(){return e.store.liveQuery(function(e){return e.findRecords("person")}).then(function(t){return e.set("people",t)})}).then(function(){return e.set("isReady",!0)})},start:function(){return this.set("isDetecting",!0),this.detect()},stop:function(){this.set("isDetecting",!1)},detect:function(){var e=this
return this.setup().then(function(){return Ember.RSVP.hash({frame:e.webcam.getFrame(),faceMatcher:e.faceMatcher})}).then(function(t){var n=t.frame,r=t.faceMatcher
return e.FaceAPI.detectAllFaces(n).withFaceLandmarks().withFaceDescriptors().then(function(t){return e.set("faces",t.map(function(e){return a.create({frame:n,detection:e,matches:r.match(e.descriptor)})}))})}).then(function(t){return e.isDetecting&&(e.nextRun=Ember.run.next(e,e.detect)),t})},faceMatcher:Ember.computed("people.[]",function(){var e=this,t=this.setup().then(function(){return Ember.RSVP.all(e.people.map(function(t){return(n=t.image,new Ember.RSVP.Promise(function(e){var t=document.createElement("img")
t.onload=function(){return e(t)},t.src=n})).then(function(t){return e.FaceAPI.detectSingleFace(t).withFaceLandmarks().withFaceDescriptor()}).then(function(e){return e?{person:t,descriptors:[e.descriptor]}:null})
var n})).then(function(e){return i.create({candidates:e.compact()})})})
return r.create({promise:t})}),willDestroy:function(){this._super.apply(this,arguments),Ember.run.cancel(this.nextRun)}})
e.default=o
var i=Ember.Object.extend({match:function(e){var t=this
return this.candidates.map(function(n){return{person:n.person,distance:t.computeMeanDistance(e,n.descriptors)}})},computeMeanDistance:function(e,n){return n.map(function(n){return t.default.euclideanDistance(n,e)}).reduce(function(e,t){return e+t},0)/(n.length||1)}})
e.FaceMatcher=i
var a=Ember.Object.extend({box:Ember.computed.reads("detection.detection.box"),size:Ember.computed("box",function(){return this.box.width*this.box.height}),image:Ember.computed("box","frame",function(){var e=document.createElement("canvas"),t=function(e,t,n){var r={left:Math.max(0,e.left-n),top:Math.max(0,e.top-n)}
return r.width=Math.min(t.width-r.left,e.width+2*n),r.height=Math.min(t.height-r.top,e.height+2*n),r}(this.box,this.frame,(this.box.width+this.box.height)/4)
return e.width=t.width,e.height=t.height,e.getContext("2d").drawImage(this.frame,t.left,t.top,t.width,t.height,0,0,t.width,t.height),e}),confidentMatch:Ember.computed("matches",function(){var e=this.matches.filter(function(e){return e.distance<.5})
return 1===e.length?e[0]:null}),probableMatches:Ember.computed("matches",function(){return this.matches.filter(function(e){return e.distance>=.5&&e.distance<.8})})})
e.Face=a}),define("coffee-police/services/face-ranker",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.Service.extend({faceDetector:Ember.inject.service(),detect:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,o=Date.now()
return function e(t,o,i,a){return t.detect().then(function(c){(a=a||{confident:[],probable:[]}).confident=a.confident.concat(c.map(function(e){return n(e,[e.confidentMatch])}).reduce(function(e,t){return e.concat(t)},[])),a.probable=a.probable.concat(c.map(function(e){return n(e,e.probableMatches)}).reduce(function(e,t){return e.concat(t)},[]))
var l=function(e){var t=function(e){var t=e.confident,n=e.probable,r=t.mapBy("face.size").concat(n.mapBy("face.size")).sort().lastObject,o=.75*r
o&&(t=t.filter(function(e){return e.face.size>o}),n=n.filter(function(e){return e.face.size>o}))
return Ember.assign({},e,{confident:t,probable:n,maxSize:r})}(e),n=t.confident,o=t.probable,i=t.maxSize
if(1===r(n,i).length)return n[0].match.person
var a=r(n.concat(o),i)
return a.length>0?a.sort(function(e,t){return t.distance-e.distance}).mapBy("person"):null}(a)
return Date.now()>=i?l:Date.now()>=o&&l&&!Ember.isArray(l)?l:new Ember.RSVP.Promise(function(n){return Ember.run.next(function(){return n(e(t,o,i))})})})}(this.faceDetector,o+e,o+t)}})
function n(e){return(arguments.length>1&&void 0!==arguments[1]?arguments[1]:[]).compact().map(function(t){return{match:t,face:e}})}function r(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,n=[]
return e.forEach(function(e){var r=e.match.person,o=n.findBy("person",r)
o||(o={person:r,distances:[],sizes:[]},n.push(o)),o.sizes.push(1-(e.face.size||0)/t),o.distances.push(e.match.distance)}),n.map(function(e){return{distance:o(e.distances)*o(e.sizes),person:e.person}})}function o(e){var t=e.reduce(function(e,t){return e*t},1)
return Math.pow(t,1/e.length)}e.default=t}),define("coffee-police/services/webcam",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.Service.extend({stream:null,isReady:!1,isPlaying:!1,isSupported:Ember.computed(function(){return navigator.mediaDevices&&navigator.mediaDevices.getUserMedia}),setup:function(){var e=this
return this.setupPromise=this.setupPromise||(this.isSupported?navigator.mediaDevices.getUserMedia({video:{facingMode:"user"}}):Ember.RSVP.reject("This browser doesn’t support user media")).then(function(t){return e.setProperties({stream:t,isReady:!0})})},start:function(){var e=this
return this.setup().then(function(){e.isPlaying||(e.video.play(),e.set("isPlaying",!0))})},stop:function(){this.isPlaying&&(this.video.pause(),this.set("isPlaying",!1))},getFrame:function(){var e=this,t=this.isPlaying
return this.start().then(function(){var n=document.createElement("canvas")
return n.width=e.video.videoWidth,n.height=e.video.videoHeight,n.getContext("2d").drawImage(e.video,0,0,e.video.videoWidth,e.video.videoHeight),t||e.stop(),n})},video:Ember.computed("stream",function(){var e=document.createElement("video")
return e.srcObject=this.stream,e})})
e.default=t}),define("coffee-police/utils/bem-states",["exports"],function(e){function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(){for(var e={},n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o]
"object"===t(r[0])&&(e=r.shift())
var i=[],a={bemNamespace:Ember.computed.reads("styleNamespace")}
if(r.forEach(function(n){var r="".concat(n,"Class")
e.element&&(r=[e.element,Ember.String.classify(r)].join("")),a[r]=Ember.computed(n,"bemNamespace",function(){var r=Ember.String.dasherize(n.replace(/^(is|has)/,"")),o=n.match(/^has/)?"no":"not",i=this.get(n)
return["string","number"].includes(t(i))&&(i=String(i),r=[r,Ember.String.dasherize(i)].join("-")),[[this.bemNamespace,e.element].compact().join("__"),i?r:[o,r].join("-")].join("--")}),i.push(r)}),e.element){var c="".concat(e.element,"Class")
a[c]=Ember.computed.apply(void 0,i.concat(["bemNamespace",function(){var t,n=this
return["".concat(this.bemNamespace,"__").concat(e.element)].concat((t=i.map(function(e){return n.get(e)}),function(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t]
return n}}(t)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}())).join(" ")}]))}else a.classNameBindings=i.concat(["bemNamespace"])
return a}}),define("coffee-police/config/environment",[],function(){try{var e="coffee-police/config/environment",t=document.querySelector('meta[name="'+e+'"]').getAttribute("content"),n={default:JSON.parse(decodeURIComponent(t))}
return Object.defineProperty(n,"__esModule",{value:!0}),n}catch(r){throw new Error('Could not read config from meta tag with name "'+e+'".')}}),runningTests||require("coffee-police/app").default.create({name:"coffee-police",version:"0.0.0+a1d7276b"})
