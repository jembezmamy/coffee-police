'use strict';



;define("coffee-police/app", ["exports", "coffee-police/resolver", "ember-load-initializers", "coffee-police/config/environment"], function (_exports, _resolver, _emberLoadInitializers, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  const App = Ember.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });
  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);
  var _default = App;
  _exports.default = _default;
});
;define("coffee-police/application/route", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Route.extend({
    dataCoordinator: Ember.inject.service(),

    async beforeModel() {
      const backup = this.dataCoordinator.getSource('backup');
      const transform = await backup.pull(q => q.findRecords());
      await this.store.sync(transform);
      await this.dataCoordinator.activate();
    }

  });

  _exports.default = _default;
});
;define("coffee-police/components/people-list/component", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    store: Ember.inject.service(),

    didInsertElement() {
      this._super(...arguments);

      this.store.liveQuery(q => q.findRecords('person')).then(people => this.set('people', people));
    }

  });

  _exports.default = _default;
});
;define("coffee-police/components/people-list/form/component", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    tagName: 'form',
    'data-test-person-form': true,
    faceDetector: Ember.inject.service(),
    store: Ember.inject.service(),
    actions: {
      submit() {
        this.faceDetector.detect().then(faces => {
          if (faces[0]) {
            return this.store.addRecord({
              type: 'person',
              name: this.name,
              image: faces[0].image.toDataURL()
            });
          } else {
            throw 'no face detected';
          }
        }).then(() => this.set('name', ''));
      }

    }
  });

  _exports.default = _default;
});
;define("coffee-police/components/people-list/form/template", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "mNuParCs",
    "block": "{\"symbols\":[],\"statements\":[[5,\"input\",[[12,\"name\",\"person[name]\"]],[[\"@value\"],[[22,\"name\"]]]],[0,\"\\n\"],[7,\"input\",false],[12,\"value\",\"Add person\"],[12,\"disabled\",[28,\"not\",[[24,[\"name\"]]],null]],[12,\"type\",\"submit\"],[3,\"action\",[[23,0,[]],\"submit\"]],[8],[9],[0,\"\\n\"]],\"hasEval\":false}",
    "meta": {
      "moduleName": "coffee-police/components/people-list/form/template.hbs"
    }
  });

  _exports.default = _default;
});
;define("coffee-police/components/people-list/item/component", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    'data-test-person': true,
    actions: {
      remove() {
        this.model.remove();
      }

    }
  });

  _exports.default = _default;
});
;define("coffee-police/components/people-list/item/template", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "ux4Vm1uj",
    "block": "{\"symbols\":[],\"statements\":[[7,\"img\",true],[11,\"src\",[24,[\"model\",\"image\"]]],[11,\"class\",[29,[[22,\"styleNamespace\"],\"__image\"]]],[11,\"alt\",[24,[\"model\",\"name\"]]],[8],[9],[0,\"\\n\\n\"],[1,[24,[\"model\",\"name\"]],false],[0,\"\\n\\n\"],[7,\"button\",false],[12,\"name\",[29,[\"removePerson[\",[24,[\"model\",\"id\"]],\"]\"]]],[12,\"type\",\"button\"],[3,\"action\",[[23,0,[]],\"remove\"]],[8],[0,\"\\n  Remove\\n\"],[9],[0,\"\\n\"]],\"hasEval\":false}",
    "meta": {
      "moduleName": "coffee-police/components/people-list/item/template.hbs"
    }
  });

  _exports.default = _default;
});
;define("coffee-police/components/people-list/template", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "iBCaW3JW",
    "block": "{\"symbols\":[\"person\"],\"statements\":[[5,\"people-list/form\",[],[[],[]]],[0,\"\\n\\n\"],[4,\"each\",[[24,[\"people\"]]],null,{\"statements\":[[0,\"  \"],[5,\"people-list/item\",[],[[\"@model\"],[[23,1,[]]]]],[0,\"\\n\"]],\"parameters\":[1]},null]],\"hasEval\":false}",
    "meta": {
      "moduleName": "coffee-police/components/people-list/template.hbs"
    }
  });

  _exports.default = _default;
});
;define("coffee-police/components/person-detector/component", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    faceRanker: Ember.inject.service(),
    actions: {
      detect() {
        this.setProperties({
          isDetecting: true,
          didDetect: false,
          results: null
        });
        this.faceRanker.detect(1000, 3000).then(results => this.set('results', results && results.length ? results.slice(0, 3) : results)).finally(() => this.setProperties({
          isDetecting: false,
          didDetect: true
        }));
      }

    }
  });

  _exports.default = _default;
});
;define("coffee-police/components/person-detector/template", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "M6CDEjiS",
    "block": "{\"symbols\":[\"person\"],\"statements\":[[7,\"button\",false],[12,\"name\",\"detect\"],[12,\"disabled\",[22,\"isDetecting\"]],[12,\"type\",\"button\"],[3,\"action\",[[23,0,[]],\"detect\"]],[8],[0,\"\\n  Detect!\\n\"],[9],[0,\"\\n\\n\"],[4,\"if\",[[24,[\"results\"]]],null,{\"statements\":[[4,\"if\",[[24,[\"results\",\"length\"]]],null,{\"statements\":[[0,\"    Hi,\\n\"],[4,\"each\",[[24,[\"results\"]]],null,{\"statements\":[[0,\"      \"],[1,[23,1,[\"name\"]],false],[0,\",\\n\"]],\"parameters\":[1]},null],[0,\"    or someone else...?\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"    Hi, \"],[1,[24,[\"results\",\"name\"]],false],[0,\"!\\n\"]],\"parameters\":[]}]],\"parameters\":[]},{\"statements\":[[4,\"if\",[[24,[\"didDetect\"]]],null,{\"statements\":[[0,\"    Do we know each other...?\\n\"]],\"parameters\":[]},null]],\"parameters\":[]}]],\"hasEval\":false}",
    "meta": {
      "moduleName": "coffee-police/components/person-detector/template.hbs"
    }
  });

  _exports.default = _default;
});
;define("coffee-police/components/video-preview/box/component", ["exports", "coffee-police/utils/bem-states"], function (_exports, _bemStates) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend((0, _bemStates.default)('isConfident'), {
    attributeBindings: ['style'],
    'data-test-box': true,
    box: Ember.computed.reads('model.box'),
    style: Ember.computed('box.{left,top,width,height}', function () {
      return ['left', 'top', 'width', 'height'].map(dim => "".concat(dim, ": ").concat(this.get("box.".concat(dim)), "px")).join('; ').htmlSafe();
    }),
    isConfident: Ember.computed('model.confidentMatch', function () {
      return !!this.model.confidentMatch;
    })
  });

  _exports.default = _default;
});
;define("coffee-police/components/video-preview/box/template", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "SUfqFUck",
    "block": "{\"symbols\":[\"&default\"],\"statements\":[[14,1],[0,\"\\n\"],[1,[24,[\"model\",\"confidentMatch\",\"person\",\"name\"]],false],[0,\"\\n\"]],\"hasEval\":false}",
    "meta": {
      "moduleName": "coffee-police/components/video-preview/box/template.hbs"
    }
  });

  _exports.default = _default;
});
;define("coffee-police/components/video-preview/component", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    webcam: Ember.inject.service(),
    faceDetector: Ember.inject.service(),

    didInsertElement() {
      this._super(...arguments);

      this.webcam.start().then(() => this.faceDetector.start()).then(() => this.element.querySelector('video').srcObject = this.webcam.stream);
    }

  });

  _exports.default = _default;
});
;define("coffee-police/components/video-preview/template", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "26w8wwjl",
    "block": "{\"symbols\":[\"face\"],\"statements\":[[7,\"video\",true],[10,\"autoplay\",\"\"],[10,\"muted\",\"\"],[8],[9],[0,\"\\n\\n\"],[4,\"each\",[[24,[\"faceDetector\",\"faces\"]]],null,{\"statements\":[[0,\"  \"],[1,[28,\"video-preview/box\",null,[[\"model\"],[[23,1,[]]]]],false],[0,\"\\n\"]],\"parameters\":[1]},null]],\"hasEval\":false}",
    "meta": {
      "moduleName": "coffee-police/components/video-preview/template.hbs"
    }
  });

  _exports.default = _default;
});
;define("coffee-police/components/welcome-page", ["exports", "ember-welcome-page/components/welcome-page"], function (_exports, _welcomePage) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _welcomePage.default;
    }
  });
});
;define("coffee-police/data-models/person", ["exports", "ember-orbit"], function (_exports, _emberOrbit) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _emberOrbit.Model.extend({
    name: (0, _emberOrbit.attr)('string'),
    image: (0, _emberOrbit.attr)('string')
  });

  _exports.default = _default;
});
;define("coffee-police/data-sources/backup", ["exports", "@orbit/indexeddb"], function (_exports, _indexeddb) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = {
    create(injections = {}) {
      injections.name = 'backup';
      injections.namespace = 'coffe-police';
      return new _indexeddb.default(injections);
    }

  };
  _exports.default = _default;
});
;define("coffee-police/data-strategies/store-backup-sync", ["exports", "@orbit/coordinator"], function (_exports, _coordinator) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = {
    create() {
      return new _coordinator.SyncStrategy({
        name: 'store-backup-sync',
        source: 'store',
        target: 'backup',
        blocking: true
      });
    }

  };
  _exports.default = _default;
});
;define("coffee-police/helpers/and", ["exports", "ember-truth-helpers/helpers/and"], function (_exports, _and) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _and.default;
    }
  });
  Object.defineProperty(_exports, "and", {
    enumerable: true,
    get: function () {
      return _and.and;
    }
  });
});
;define("coffee-police/helpers/app-version", ["exports", "coffee-police/config/environment", "ember-cli-app-version/utils/regexp"], function (_exports, _environment, _regexp) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.appVersion = appVersion;
  _exports.default = void 0;

  function appVersion(_, hash = {}) {
    const version = _environment.default.APP.version; // e.g. 1.0.0-alpha.1+4jds75hf
    // Allow use of 'hideSha' and 'hideVersion' For backwards compatibility

    let versionOnly = hash.versionOnly || hash.hideSha;
    let shaOnly = hash.shaOnly || hash.hideVersion;
    let match = null;

    if (versionOnly) {
      if (hash.showExtended) {
        match = version.match(_regexp.versionExtendedRegExp); // 1.0.0-alpha.1
      } // Fallback to just version


      if (!match) {
        match = version.match(_regexp.versionRegExp); // 1.0.0
      }
    }

    if (shaOnly) {
      match = version.match(_regexp.shaRegExp); // 4jds75hf
    }

    return match ? match[0] : version;
  }

  var _default = Ember.Helper.helper(appVersion);

  _exports.default = _default;
});
;define("coffee-police/helpers/eq", ["exports", "ember-truth-helpers/helpers/equal"], function (_exports, _equal) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _equal.default;
    }
  });
  Object.defineProperty(_exports, "equal", {
    enumerable: true,
    get: function () {
      return _equal.equal;
    }
  });
});
;define("coffee-police/helpers/gt", ["exports", "ember-truth-helpers/helpers/gt"], function (_exports, _gt) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _gt.default;
    }
  });
  Object.defineProperty(_exports, "gt", {
    enumerable: true,
    get: function () {
      return _gt.gt;
    }
  });
});
;define("coffee-police/helpers/gte", ["exports", "ember-truth-helpers/helpers/gte"], function (_exports, _gte) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _gte.default;
    }
  });
  Object.defineProperty(_exports, "gte", {
    enumerable: true,
    get: function () {
      return _gte.gte;
    }
  });
});
;define("coffee-police/helpers/is-array", ["exports", "ember-truth-helpers/helpers/is-array"], function (_exports, _isArray) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _isArray.default;
    }
  });
  Object.defineProperty(_exports, "isArray", {
    enumerable: true,
    get: function () {
      return _isArray.isArray;
    }
  });
});
;define("coffee-police/helpers/is-empty", ["exports", "ember-truth-helpers/helpers/is-empty"], function (_exports, _isEmpty) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _isEmpty.default;
    }
  });
});
;define("coffee-police/helpers/is-equal", ["exports", "ember-truth-helpers/helpers/is-equal"], function (_exports, _isEqual) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _isEqual.default;
    }
  });
  Object.defineProperty(_exports, "isEqual", {
    enumerable: true,
    get: function () {
      return _isEqual.isEqual;
    }
  });
});
;define("coffee-police/helpers/lt", ["exports", "ember-truth-helpers/helpers/lt"], function (_exports, _lt) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _lt.default;
    }
  });
  Object.defineProperty(_exports, "lt", {
    enumerable: true,
    get: function () {
      return _lt.lt;
    }
  });
});
;define("coffee-police/helpers/lte", ["exports", "ember-truth-helpers/helpers/lte"], function (_exports, _lte) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _lte.default;
    }
  });
  Object.defineProperty(_exports, "lte", {
    enumerable: true,
    get: function () {
      return _lte.lte;
    }
  });
});
;define("coffee-police/helpers/not-eq", ["exports", "ember-truth-helpers/helpers/not-equal"], function (_exports, _notEqual) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _notEqual.default;
    }
  });
  Object.defineProperty(_exports, "notEq", {
    enumerable: true,
    get: function () {
      return _notEqual.notEq;
    }
  });
});
;define("coffee-police/helpers/not", ["exports", "ember-truth-helpers/helpers/not"], function (_exports, _not) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _not.default;
    }
  });
  Object.defineProperty(_exports, "not", {
    enumerable: true,
    get: function () {
      return _not.not;
    }
  });
});
;define("coffee-police/helpers/or", ["exports", "ember-truth-helpers/helpers/or"], function (_exports, _or) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _or.default;
    }
  });
  Object.defineProperty(_exports, "or", {
    enumerable: true,
    get: function () {
      return _or.or;
    }
  });
});
;define("coffee-police/helpers/pluralize", ["exports", "ember-inflector/lib/helpers/pluralize"], function (_exports, _pluralize) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = _pluralize.default;
  _exports.default = _default;
});
;define("coffee-police/helpers/singularize", ["exports", "ember-inflector/lib/helpers/singularize"], function (_exports, _singularize) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = _singularize.default;
  _exports.default = _default;
});
;define("coffee-police/helpers/xor", ["exports", "ember-truth-helpers/helpers/xor"], function (_exports, _xor) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _xor.default;
    }
  });
  Object.defineProperty(_exports, "xor", {
    enumerable: true,
    get: function () {
      return _xor.xor;
    }
  });
});
;define("coffee-police/index/template", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "nXpXl1Ft",
    "block": "{\"symbols\":[],\"statements\":[[5,\"video-preview\",[],[[],[]]],[0,\"\\n\\n\"],[5,\"person-detector\",[],[[],[]]],[0,\"\\n\\n\"],[5,\"people-list\",[],[[],[]]],[0,\"\\n\"]],\"hasEval\":false}",
    "meta": {
      "moduleName": "coffee-police/index/template.hbs"
    }
  });

  _exports.default = _default;
});
;define("coffee-police/initializers/app-version", ["exports", "ember-cli-app-version/initializer-factory", "coffee-police/config/environment"], function (_exports, _initializerFactory, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  let name, version;

  if (_environment.default.APP) {
    name = _environment.default.APP.name;
    version = _environment.default.APP.version;
  }

  var _default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
  _exports.default = _default;
});
;define("coffee-police/initializers/component-styles", ["exports", "ember-component-css/initializers/component-styles", "coffee-police/mixins/style-namespacing-extras"], function (_exports, _componentStyles, _styleNamespacingExtras) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _componentStyles.default;
    }
  });
  Object.defineProperty(_exports, "initialize", {
    enumerable: true,
    get: function () {
      return _componentStyles.initialize;
    }
  });
  // eslint-disable-next-line ember/new-module-imports
  Ember.Component.reopen(_styleNamespacingExtras.default);
});
;define("coffee-police/initializers/container-debug-adapter", ["exports", "ember-resolver/resolvers/classic/container-debug-adapter"], function (_exports, _containerDebugAdapter) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = {
    name: 'container-debug-adapter',

    initialize() {
      let app = arguments[1] || arguments[0];
      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }

  };
  _exports.default = _default;
});
;define("coffee-police/initializers/ember-data", ["exports", "ember-data/setup-container", "ember-data"], function (_exports, _setupContainer, _emberData) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    ```app/services/store.js
    import DS from 'ember-data';
  
    export default DS.Store.extend({
      adapter: 'custom'
    });
    ```
  
    ```app/controllers/posts.js
    import { Controller } from '@ember/controller';
  
    export default Controller.extend({
      // ...
    });
  
    When the application is initialized, `ApplicationStore` will automatically be
    instantiated, and the instance of `PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */
  var _default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
  _exports.default = _default;
});
;define("coffee-police/initializers/ember-orbit-config", ["exports", "ember-orbit/initializers/ember-orbit-config"], function (_exports, _emberOrbitConfig) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _emberOrbitConfig.default;
    }
  });
  Object.defineProperty(_exports, "initialize", {
    enumerable: true,
    get: function () {
      return _emberOrbitConfig.initialize;
    }
  });
});
;define("coffee-police/initializers/ember-orbit-services", ["exports", "ember-orbit/initializers/ember-orbit-services"], function (_exports, _emberOrbitServices) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _emberOrbitServices.default;
    }
  });
  Object.defineProperty(_exports, "initialize", {
    enumerable: true,
    get: function () {
      return _emberOrbitServices.initialize;
    }
  });
});
;define("coffee-police/initializers/export-application-global", ["exports", "coffee-police/config/environment"], function (_exports, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.initialize = initialize;
  _exports.default = void 0;

  function initialize() {
    var application = arguments[1] || arguments[0];

    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;

      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;
        application.reopen({
          willDestroy: function () {
            this._super.apply(this, arguments);

            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  var _default = {
    name: 'export-application-global',
    initialize: initialize
  };
  _exports.default = _default;
});
;define("coffee-police/instance-initializers/ember-data", ["exports", "ember-data/initialize-store-service"], function (_exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = {
    name: 'ember-data',
    initialize: _initializeStoreService.default
  };
  _exports.default = _default;
});
;define("coffee-police/instance-initializers/route-styles", ["exports", "ember-component-css/instance-initializers/route-styles"], function (_exports, _routeStyles) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _routeStyles.default;
    }
  });
  Object.defineProperty(_exports, "initialize", {
    enumerable: true,
    get: function () {
      return _routeStyles.initialize;
    }
  });
});
;define("coffee-police/mixins/style-namespacing-extras", ["exports", "ember-component-css/mixins/style-namespacing-extras"], function (_exports, _styleNamespacingExtras) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _styleNamespacingExtras.default;
    }
  });
});
;define("coffee-police/resolver", ["exports", "ember-resolver"], function (_exports, _emberResolver) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = _emberResolver.default;
  _exports.default = _default;
});
;define("coffee-police/router", ["exports", "coffee-police/config/environment"], function (_exports, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  const Router = Ember.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });
  Router.map(function () {});
  var _default = Router;
  _exports.default = _default;
});
;define("coffee-police/services/ajax", ["exports", "ember-ajax/services/ajax"], function (_exports, _ajax) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
;define("coffee-police/services/face-detector", ["exports", "face-api.js", "coffee-police/config/environment"], function (_exports, _faceApi, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Face = _exports.FaceMatcher = _exports.default = void 0;
  const CONFIDENCE_THRESHOLD = 0.5;
  const PROBABILITY_THRESHOLD = 0.8;
  const ObjectPromiseProxy = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);

  var _default = Ember.Service.extend({
    webcam: Ember.inject.service(),
    store: Ember.inject.service(),
    FaceAPI: _faceApi.default,
    isReady: false,
    isDetecting: false,

    setup() {
      return this.loadPromise = this.loadPromise || Ember.RSVP.all(['ssdMobilenetv1', 'faceRecognitionNet', 'faceLandmark68Net'].map(net => this.FaceAPI.nets[net].loadFromUri("".concat(_environment.default.rootURL, "models")))).then(() => this.store.liveQuery(q => q.findRecords('person')).then(people => this.set('people', people))).then(() => this.set('isReady', true));
    },

    start() {
      this.set('isDetecting', true);
      return this.detect();
    },

    stop() {
      this.set('isDetecting', false);
    },

    detect() {
      return this.setup().then(() => Ember.RSVP.hash({
        frame: this.webcam.getFrame(),
        faceMatcher: this.faceMatcher
      })).then(({
        frame,
        faceMatcher
      }) => this.FaceAPI.detectAllFaces(frame).withFaceLandmarks().withFaceDescriptors().then(faces => this.set('faces', faces.map(detection => Face.create({
        frame,
        detection,
        matches: faceMatcher.match(detection.descriptor)
      }))))).then(faces => {
        if (this.isDetecting) {
          this.nextRun = Ember.run.next(this, this.detect);
        }

        return faces;
      });
    },

    faceMatcher: Ember.computed('people.[]', function () {
      let promise = this.setup().then(() => Ember.RSVP.all(this.people.map(person => loadImage(person.image).then(img => this.FaceAPI.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()).then(result => result ? {
        person,
        descriptors: [result.descriptor]
      } : null))).then(results => FaceMatcher.create({
        candidates: results.compact()
      })));
      return ObjectPromiseProxy.create({
        promise
      });
    }),

    willDestroy() {
      this._super(...arguments);

      Ember.run.cancel(this.nextRun);
    }

  });

  _exports.default = _default;
  const FaceMatcher = Ember.Object.extend({
    match(queryDescriptor) {
      return this.candidates.map(candidate => ({
        person: candidate.person,
        distance: this.computeMeanDistance(queryDescriptor, candidate.descriptors)
      }));
    },

    computeMeanDistance(queryDescriptor, descriptors) {
      return descriptors.map(d => _faceApi.default.euclideanDistance(d, queryDescriptor)).reduce((d1, d2) => d1 + d2, 0) / (descriptors.length || 1);
    }

  });
  _exports.FaceMatcher = FaceMatcher;
  const Face = Ember.Object.extend({
    box: Ember.computed.reads('detection.detection.box'),
    size: Ember.computed('box', function () {
      return this.box.width * this.box.height;
    }),
    image: Ember.computed('box', 'frame', function () {
      let canvas = document.createElement('canvas');
      let box = expand(this.box, this.frame, (this.box.width + this.box.height) / 4);
      canvas.width = box.width;
      canvas.height = box.height;
      canvas.getContext('2d').drawImage(this.frame, box.left, box.top, box.width, box.height, 0, 0, box.width, box.height);
      return canvas;
    }),
    confidentMatch: Ember.computed('matches', function () {
      let matched = this.matches.filter(m => m.distance < CONFIDENCE_THRESHOLD);
      return matched.length === 1 ? matched[0] : null;
    }),
    probableMatches: Ember.computed('matches', function () {
      return this.matches.filter(m => m.distance >= CONFIDENCE_THRESHOLD && m.distance < PROBABILITY_THRESHOLD);
    })
  });
  _exports.Face = Face;

  function expand(box, limits, amount) {
    let expanded = {
      left: Math.max(0, box.left - amount),
      top: Math.max(0, box.top - amount)
    };
    expanded.width = Math.min(limits.width - expanded.left, box.width + amount * 2);
    expanded.height = Math.min(limits.height - expanded.top, box.height + amount * 2);
    return expanded;
  }

  function loadImage(src) {
    return new Ember.RSVP.Promise(resolve => {
      let img = document.createElement('img');

      img.onload = () => resolve(img);

      img.src = src;
    });
  }
});
;define("coffee-police/services/face-ranker", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Service.extend({
    faceDetector: Ember.inject.service(),

    detect(minTimeout = 0, maxTimeout = 0) {
      let currentTime = Date.now();
      return performDetection(this.faceDetector, currentTime + minTimeout, currentTime + maxTimeout);
    }

  });

  _exports.default = _default;

  function performDetection(faceDetector, minTime, maxTime, results) {
    return faceDetector.detect().then(faces => {
      results = results || {
        confident: [],
        probable: []
      };
      results.confident = results.confident.concat(faces.map(face => wrapMatches(face, [face.confidentMatch])).reduce((a, b) => a.concat(b), []));
      results.probable = results.probable.concat(faces.map(face => wrapMatches(face, face.probableMatches)).reduce((a, b) => a.concat(b), []));
      let rankedResults = rankResults(results);

      if (Date.now() >= maxTime) {
        return rankedResults;
      } else if (Date.now() >= minTime && rankedResults && !Ember.isArray(rankedResults)) {
        return rankedResults;
      } else {
        return new Ember.RSVP.Promise(resolve => Ember.run.next(() => resolve(performDetection(faceDetector, minTime, maxTime))));
      }
    });
  }

  function wrapMatches(face, matches = []) {
    return matches.compact().map(match => ({
      match,
      face
    }));
  }

  function rankResults(results) {
    let {
      confident,
      probable,
      maxSize
    } = filterBySize(results);

    if (groupByPerson(confident, maxSize).length === 1) {
      return confident[0].match.person;
    } else {
      let merged = groupByPerson(confident.concat(probable), maxSize);

      if (merged.length > 0) {
        return merged.sort((a, b) => b.distance - a.distance).mapBy('person');
      } else {
        return null;
      }
    }
  }

  function filterBySize(results) {
    let {
      confident,
      probable
    } = results;
    let maxSize = confident.mapBy('face.size').concat(probable.mapBy('face.size')).sort().lastObject;
    let threshold = maxSize * 0.75;

    if (threshold) {
      confident = confident.filter(f => f.face.size > threshold);
      probable = probable.filter(f => f.face.size > threshold);
    }

    return Ember.assign({}, results, {
      confident,
      probable,
      maxSize
    });
  }

  function groupByPerson(matches, maxSize = 1) {
    let groups = [];
    matches.forEach(match => {
      let person = match.match.person;
      let group = groups.findBy('person', person);

      if (!group) {
        group = {
          person,
          distances: [],
          sizes: []
        };
        groups.push(group);
      }

      group.sizes.push(1 - (match.face.size || 0) / maxSize);
      group.distances.push(match.match.distance);
    });
    return groups.map(group => ({
      distance: geometricMean(group.distances) * geometricMean(group.sizes),
      person: group.person
    }));
  }

  function geometricMean(values) {
    let product = values.reduce((a, b) => a * b, 1);
    return Math.pow(product, 1 / values.length);
  }
});
;define("coffee-police/services/webcam", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Service.extend({
    stream: null,
    isReady: false,
    isPlaying: false,
    isSupported: Ember.computed(function () {
      return navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
    }),

    setup() {
      return this.setupPromise = this.setupPromise || (this.isSupported ? navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user'
        }
      }) : Ember.RSVP.reject('This browser doesn’t support user media')).then(stream => this.setProperties({
        stream,
        isReady: true
      }));
    },

    start() {
      return this.setup().then(() => {
        if (!this.isPlaying) {
          this.video.play();
          this.set('isPlaying', true);
        }
      });
    },

    stop() {
      if (this.isPlaying) {
        this.video.pause();
        this.set('isPlaying', false);
      }
    },

    getFrame() {
      let wasPlaying = this.isPlaying;
      return this.start().then(() => {
        let canvas = document.createElement('canvas');
        canvas.width = this.video.videoWidth;
        canvas.height = this.video.videoHeight;
        canvas.getContext('2d').drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight);

        if (!wasPlaying) {
          this.stop();
        }

        return canvas;
      });
    },

    video: Ember.computed('stream', function () {
      let video = document.createElement('video');
      video.srcObject = this.stream;
      return video;
    })
  });

  _exports.default = _default;
});
;define("coffee-police/utils/bem-states", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _default;

  function _default(...flags) {
    let options = {};

    if (typeof flags[0] === 'object') {
      options = flags.shift();
    }

    let classNameBindings = [];
    let object = {
      bemNamespace: Ember.computed.reads('styleNamespace')
    };
    flags.forEach(flag => {
      let classAttribute = "".concat(flag, "Class");

      if (options.element) {
        classAttribute = [options.element, Ember.String.classify(classAttribute)].join('');
      }

      object[classAttribute] = Ember.computed(flag, 'bemNamespace', function () {
        let state = Ember.String.dasherize(flag.replace(/^(is|has)/, ''));
        let not = flag.match(/^has/) ? 'no' : 'not';
        let value = this.get(flag);

        if (['string', 'number'].includes(typeof value)) {
          value = String(value);
          state = [state, Ember.String.dasherize(value)].join('-');
        }

        return [[this.bemNamespace, options.element].compact().join('__'), value ? state : [not, state].join('-')].join('--');
      });
      classNameBindings.push(classAttribute);
    });

    if (options.element) {
      let elementClassAttribute = "".concat(options.element, "Class");
      object[elementClassAttribute] = Ember.computed(...classNameBindings, 'bemNamespace', function () {
        return ["".concat(this.bemNamespace, "__").concat(options.element), ...classNameBindings.map(name => this.get(name))].join(' ');
      });
    } else {
      object.classNameBindings = classNameBindings.concat(['bemNamespace']);
    }

    return object;
  }
});
;

;define('coffee-police/config/environment', [], function() {
  var prefix = 'coffee-police';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(decodeURIComponent(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

;
          if (!runningTests) {
            require("coffee-police/app")["default"].create({"name":"coffee-police","version":"0.0.0+503426e5"});
          }
        
//# sourceMappingURL=coffee-police.map
