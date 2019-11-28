'use strict';

define("coffee-police/tests/helpers/finish-render", ["exports", "@ember/test-helpers"], function (_exports, _testHelpers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _default;

  function _default() {
    return (0, _testHelpers.waitUntil)(() => {
      let {
        hasRunLoop,
        hasPendingRequests,
        hasPendingWaiters
      } = (0, _testHelpers.getSettledState)();

      if (hasRunLoop || hasPendingRequests || hasPendingWaiters) {
        return false;
      }

      return true;
    });
  }
});
define("coffee-police/tests/helpers/image", ["exports", "sinon"], function (_exports, _sinon) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.sampleImage = sampleImage;
  _exports.sampleVideo = sampleVideo;

  function sampleImage() {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = 'blue';
    ctx.fillRect(randomInt(150), randomInt(75), randomInt(150), randomInt(75));
    return canvas;
  }

  function sampleVideo() {
    let image = sampleImage();
    image.play = _sinon.default.stub();
    image.pause = _sinon.default.stub();
    image.videoWidth = image.width;
    image.videoHeight = image.height;
    return image;
  }

  function randomInt(max) {
    return Math.floor(Math.random() * max);
  }
});
define("coffee-police/tests/integration/components/people-list/component-test", ["qunit", "ember-qunit", "@ember/test-helpers"], function (_qunit, _emberQunit, _testHelpers) {
  "use strict";

  (0, _qunit.module)('Integration | Component | people-list', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('it renders', async function (assert) {
      let store = this.owner.lookup('service:store');
      await store.addRecord({
        type: 'person',
        name: 'John'
      });
      await store.addRecord({
        type: 'person',
        name: 'Kate'
      });
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "N4pccOoS",
        "block": "{\"symbols\":[],\"statements\":[[5,\"people-list\",[],[[],[]]]],\"hasEval\":false}",
        "meta": {}
      }));
      assert.dom('[data-test-person-form]').exists();
      assert.dom('[data-test-person]').exists({
        count: 2
      });
    });
  });
});
define("coffee-police/tests/integration/components/people-list/form/component-test", ["qunit", "ember-qunit", "@ember/test-helpers", "sinon"], function (_qunit, _emberQunit, _testHelpers, _sinon) {
  "use strict";

  (0, _qunit.module)('Integration | Component | people-list/form', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('it creates new people', async function (assert) {
      let face = {
        image: {
          toDataURL() {
            return '123456789';
          }

        }
      };

      let detect = _sinon.default.stub(this.owner.lookup('service:face-detector'), 'detect').returns(Ember.RSVP.resolve([face, {}, {}]));

      let store = this.owner.lookup('service:store');

      let addRecord = _sinon.default.spy(store, 'addRecord');

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "FjVM3Jyb",
        "block": "{\"symbols\":[],\"statements\":[[1,[22,\"people-list/form\"],false]],\"hasEval\":false}",
        "meta": {}
      }));
      assert.dom('[data-test-person-form]').exists();
      assert.dom('input[type=submit]').isDisabled();
      await (0, _testHelpers.fillIn)('input[name="person[name]"]', 'John');
      await (0, _testHelpers.click)('input[type=submit]');
      assert.ok(detect.calledOnce);
      assert.deepEqual(addRecord.getCall(0).args[0], {
        type: 'person',
        name: 'John',
        image: '123456789'
      });
      assert.dom('input[name="person[name]"]').hasValue('');
      assert.dom('input[type=submit]').isDisabled();
    });
  });
});
define("coffee-police/tests/integration/components/people-list/item/component-test", ["qunit", "ember-qunit", "@ember/test-helpers", "sinon"], function (_qunit, _emberQunit, _testHelpers, _sinon) {
  "use strict";

  (0, _qunit.module)('Integration | Component | people-list/item', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    hooks.beforeEach(async function () {
      this.model = {
        id: 242,
        name: 'Sofia',
        image: '/images/face-1.jpg',
        remove: _sinon.default.stub()
      };
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "+TqGGxG/",
        "block": "{\"symbols\":[],\"statements\":[[1,[28,\"people-list/item\",null,[[\"model\"],[[24,[\"model\"]]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));
    });
    (0, _qunit.test)('it renders', async function (assert) {
      assert.dom('[data-test-person]').exists();
      assert.dom(this.element).includesText('Sofia');
      assert.dom('img').hasAttribute('src', /face-1.jpg/);
    });
    (0, _qunit.test)('it removes records', async function (assert) {
      await (0, _testHelpers.click)('button[name="removePerson[242]"]');
      assert.ok(this.model.remove.calledOnce);
    });
  });
});
define("coffee-police/tests/integration/components/person-detector/component-test", ["qunit", "ember-qunit", "@ember/test-helpers", "sinon", "coffee-police/tests/helpers/finish-render"], function (_qunit, _emberQunit, _testHelpers, _sinon, _finishRender) {
  "use strict";

  (0, _qunit.module)('Integration | Component | person-detector', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    hooks.beforeEach(async function () {
      this.detectStub = _sinon.default.stub(this.owner.lookup('service:face-ranker'), 'detect');
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "l1cyJ2p/",
        "block": "{\"symbols\":[],\"statements\":[[5,\"person-detector\",[],[[],[]]]],\"hasEval\":false}",
        "meta": {}
      }));
    });
    (0, _qunit.test)('it calls detect() and waits for results', async function (assert) {
      let resolvePromise;
      this.detectStub.returns(new Ember.RSVP.Promise(r => resolvePromise = r));
      (0, _testHelpers.click)('button[name=detect]');
      await (0, _finishRender.default)();
      assert.dom('button[name=detect]').isDisabled();
      resolvePromise();
      await (0, _testHelpers.settled)();
      assert.dom('button[name=detect]').isNotDisabled();
    });
    (0, _qunit.test)('it renders confident match', async function (assert) {
      this.detectStub.returns(Ember.RSVP.resolve({
        name: 'Camryn Klocko'
      }));
      await (0, _testHelpers.click)('button[name=detect]');
      await (0, _finishRender.default)();
      assert.dom(this.element).includesText('Hi, Camryn Klocko');
    });
    (0, _qunit.test)('it renders probable matches', async function (assert) {
      this.detectStub.returns(Ember.RSVP.resolve([{
        name: 'Camryn Klocko'
      }, {
        name: 'William Farrell'
      }, {
        name: 'Paige McDermott'
      }, {
        name: 'Rhea Johnston'
      }, {
        name: 'Dr. Dorcas Legros'
      }]));
      await (0, _testHelpers.click)('button[name=detect]');
      await (0, _finishRender.default)();
      assert.dom(this.element).includesText('Hi, Camryn Klocko, William Farrell, Paige McDermott, or someone else...?');
      assert.dom(this.element).doesNotIncludeText('Rhea Johnston');
      assert.dom(this.element).doesNotIncludeText('Dr. Dorcas Legros');
    });
    (0, _qunit.test)('it renders no-match', async function (assert) {
      this.detectStub.returns(Ember.RSVP.resolve());
      await (0, _testHelpers.click)('button[name=detect]');
      await (0, _finishRender.default)();
      assert.dom(this.element).includesText('Do we know each other...?');
    });
  });
});
define("coffee-police/tests/integration/components/video-preview/box/component-test", ["qunit", "ember-qunit", "@ember/test-helpers"], function (_qunit, _emberQunit, _testHelpers) {
  "use strict";

  (0, _qunit.module)('Integration | Component | video-preview/box', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('it renders', async function (assert) {
      this.model = {
        box: {
          left: 12,
          top: 34,
          width: 56,
          height: 78
        }
      };
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "SEHs8+vA",
        "block": "{\"symbols\":[],\"statements\":[[1,[28,\"video-preview/box\",null,[[\"model\"],[[24,[\"model\"]]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));
      assert.dom('[data-test-box]').hasAttribute('style', /left: 12px/);
      assert.dom('[data-test-box]').hasAttribute('style', /top: 34px/);
      assert.dom('[data-test-box]').hasAttribute('style', /width: 56px/);
      assert.dom('[data-test-box]').hasAttribute('style', /height: 78px/);
    });
  });
});
define("coffee-police/tests/integration/components/video-preview/component-test", ["qunit", "ember-qunit", "@ember/test-helpers", "sinon"], function (_qunit, _emberQunit, _testHelpers, _sinon) {
  "use strict";

  (0, _qunit.module)('Integration | Component | video-preview', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    hooks.beforeEach(async function () {
      this.stream = new MediaStream();
      this.webcamStart = _sinon.default.stub().returns(Ember.RSVP.resolve());
      this.owner.register('service:webcam', Ember.Object.extend({
        start: this.webcamStart,
        stream: this.stream
      }));
      this.faceDetectorStart = _sinon.default.stub().returns(Ember.RSVP.resolve());
      this.owner.register('service:face-detector', Ember.Object.extend({
        start: this.faceDetectorStart,
        faces: Object.freeze([{}, {}])
      }));
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "83zO15PQ",
        "block": "{\"symbols\":[],\"statements\":[[5,\"video-preview\",[],[[],[]]]],\"hasEval\":false}",
        "meta": {}
      }));
    });
    (0, _qunit.test)('it displays video from the webcam service', async function (assert) {
      let video = this.element.querySelector('video');
      assert.ok(this.webcamStart.calledOnce);
      assert.equal(video.srcObject, this.stream);
    });
    (0, _qunit.test)('it displays faces from the face detector service', async function (assert) {
      assert.ok(this.faceDetectorStart.calledOnce);
      assert.dom('[data-test-box]').exists({
        count: 2
      });
    });
  });
});
define("coffee-police/tests/lint/app.lint-test", [], function () {
  "use strict";

  QUnit.module('ESLint | app');
  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });
  QUnit.test('application/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'application/route.js should pass ESLint\n\n');
  });
  QUnit.test('components/people-list/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/people-list/component.js should pass ESLint\n\n');
  });
  QUnit.test('components/people-list/form/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/people-list/form/component.js should pass ESLint\n\n');
  });
  QUnit.test('components/people-list/item/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/people-list/item/component.js should pass ESLint\n\n');
  });
  QUnit.test('components/person-detector/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/person-detector/component.js should pass ESLint\n\n');
  });
  QUnit.test('components/video-preview/box/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/video-preview/box/component.js should pass ESLint\n\n');
  });
  QUnit.test('components/video-preview/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/video-preview/component.js should pass ESLint\n\n');
  });
  QUnit.test('data-models/person.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'data-models/person.js should pass ESLint\n\n');
  });
  QUnit.test('data-sources/backup.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'data-sources/backup.js should pass ESLint\n\n');
  });
  QUnit.test('data-strategies/store-backup-sync.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'data-strategies/store-backup-sync.js should pass ESLint\n\n');
  });
  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });
  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });
  QUnit.test('services/face-detector.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/face-detector.js should pass ESLint\n\n');
  });
  QUnit.test('services/face-ranker.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/face-ranker.js should pass ESLint\n\n');
  });
  QUnit.test('services/webcam.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/webcam.js should pass ESLint\n\n');
  });
  QUnit.test('utils/bem-states.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'utils/bem-states.js should pass ESLint\n\n');
  });
});
define("coffee-police/tests/lint/templates.template.lint-test", [], function () {
  "use strict";

  QUnit.module('TemplateLint');
  QUnit.test('coffee-police/components/people-list/form/template.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'coffee-police/components/people-list/form/template.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('coffee-police/components/people-list/item/template.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'coffee-police/components/people-list/item/template.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('coffee-police/components/people-list/template.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'coffee-police/components/people-list/template.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('coffee-police/components/person-detector/template.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'coffee-police/components/person-detector/template.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('coffee-police/components/video-preview/box/template.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'coffee-police/components/video-preview/box/template.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('coffee-police/components/video-preview/template.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'coffee-police/components/video-preview/template.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('coffee-police/index/template.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'coffee-police/index/template.hbs should pass TemplateLint.\n\n');
  });
});
define("coffee-police/tests/lint/tests.lint-test", [], function () {
  "use strict";

  QUnit.module('ESLint | tests');
  QUnit.test('helpers/finish-render.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/finish-render.js should pass ESLint\n\n');
  });
  QUnit.test('helpers/image.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/image.js should pass ESLint\n\n');
  });
  QUnit.test('integration/components/people-list/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/people-list/component-test.js should pass ESLint\n\n');
  });
  QUnit.test('integration/components/people-list/form/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/people-list/form/component-test.js should pass ESLint\n\n');
  });
  QUnit.test('integration/components/people-list/item/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/people-list/item/component-test.js should pass ESLint\n\n');
  });
  QUnit.test('integration/components/person-detector/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/person-detector/component-test.js should pass ESLint\n\n');
  });
  QUnit.test('integration/components/video-preview/box/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/video-preview/box/component-test.js should pass ESLint\n\n');
  });
  QUnit.test('integration/components/video-preview/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/video-preview/component-test.js should pass ESLint\n\n');
  });
  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });
  QUnit.test('unit/services/face-detector-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/face-detector-test.js should pass ESLint\n\n');
  });
  QUnit.test('unit/services/face-ranker-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/face-ranker-test.js should pass ESLint\n\n');
  });
  QUnit.test('unit/services/webcam-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/webcam-test.js should pass ESLint\n\n');
  });
});
define("coffee-police/tests/test-helper", ["coffee-police/app", "coffee-police/config/environment", "@ember/test-helpers", "ember-qunit"], function (_app, _environment, _testHelpers, _emberQunit) {
  "use strict";

  (0, _testHelpers.setApplication)(_app.default.create(_environment.default.APP));
  (0, _emberQunit.start)();
});
define("coffee-police/tests/unit/services/face-detector-test", ["qunit", "ember-qunit", "@ember/test-helpers", "sinon", "coffee-police/services/face-detector"], function (_qunit, _emberQunit, _testHelpers, _sinon, _faceDetector) {
  "use strict";

  (0, _qunit.module)('Unit | Service | face-detector', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);
    hooks.beforeEach(function () {
      this.frame = document.createElement('canvas');
      this.getFrame = _sinon.default.stub(this.owner.lookup('service:webcam'), 'getFrame').returns(Ember.RSVP.resolve(this.frame));
      this.detectionStub = _sinon.default.stub().returns(Ember.RSVP.resolve([]));
      this.FaceAPIStub = {
        nets: {
          ssdMobilenetv1: {
            loadFromUri: _sinon.default.stub().returns(Ember.RSVP.resolve())
          },
          faceRecognitionNet: {
            loadFromUri: _sinon.default.stub().returns(Ember.RSVP.resolve())
          },
          faceLandmark68Net: {
            loadFromUri: _sinon.default.stub().returns(Ember.RSVP.resolve())
          }
        },
        detectAllFaces: _sinon.default.stub().returns({
          withFaceLandmarks: _sinon.default.stub().returns({
            withFaceDescriptors: this.detectionStub
          })
        }),
        detectSingleFace: _sinon.default.stub().returns({
          withFaceLandmarks: _sinon.default.stub().returns({
            withFaceDescriptor: _sinon.default.stub().returns({
              descriptor: [1, 2, 3]
            })
          })
        })
      };
      this.service = this.owner.lookup('service:face-detector');
      this.service.FaceAPI = this.FaceAPIStub;
    });
    (0, _qunit.module)('face detection', function (hooks) {
      hooks.beforeEach(function () {
        this.faces = [{}, {}, {}];
        this.detectionStub.returns(Ember.RSVP.resolve(this.faces));
      });
      (0, _qunit.test)('it loads models', async function (assert) {
        await this.service.setup().then(() => assert.ok(true), () => assert.ok(false));
        assert.ok(this.FaceAPIStub.nets.ssdMobilenetv1.loadFromUri.calledOnce);
        assert.ok(this.FaceAPIStub.nets.faceRecognitionNet.loadFromUri.calledOnce);
        assert.ok(this.FaceAPIStub.nets.faceLandmark68Net.loadFromUri.calledOnce);
      });
      (0, _qunit.test)('it detects faces', async function (assert) {
        let setupSpy = _sinon.default.spy(this.service, 'setup');

        await this.service.detect().then(faces => assert.equal(faces.length, this.faces.length), () => assert.ok(false));
        assert.ok(setupSpy.called);
        assert.ok(this.getFrame.calledOnce);
        assert.equal(this.FaceAPIStub.detectAllFaces.getCall(0).args[0], this.frame);
        assert.deepEqual(this.service.faces.mapBy('detection'), this.faces);
      });
      (0, _qunit.test)('it runs in loop', async function (assert) {
        let detectSpy = _sinon.default.spy(this.service, 'detect');

        await this.service.start();
        assert.ok(detectSpy.calledOnce);
        Ember.run.next(() => {
          assert.ok(detectSpy.calledTwice);
          this.service.stop();
        });
        await (0, _testHelpers.settled)();
        assert.ok(detectSpy.calledTwice);
      });
    });
    (0, _qunit.module)('face recognition', function (hooks) {
      hooks.beforeEach(async function () {
        let store = this.owner.lookup('service:store');
        this.person = await store.addRecord({
          type: 'person',
          name: 'John',
          image: '/images/face-1.jpg'
        });
        this.detectionStub.returns(Ember.RSVP.resolve([{
          descriptor: [5, 6, 7]
        }]));
      });
      (0, _qunit.test)('it defines face matcher', async function (assert) {
        let matcher = await this.service.faceMatcher;
        assert.equal(this.FaceAPIStub.detectSingleFace.getCall(0).args[0].src, "".concat(location.origin, "/images/face-1.jpg"));
        assert.ok(matcher instanceof _faceDetector.FaceMatcher);
        assert.deepEqual(matcher.candidates, [{
          descriptors: [[1, 2, 3]],
          person: this.person
        }]);
      });
      (0, _qunit.test)('it performs face match for each face', async function (assert) {
        await this.service.setup();
        let matcher = await this.service.faceMatcher;

        _sinon.default.stub(matcher, 'computeMeanDistance').returns(7.89);

        let matchSpy = _sinon.default.spy(matcher, 'match');

        let faces = await this.service.detect();
        assert.deepEqual(matchSpy.getCall(0).args[0], [5, 6, 7]);
        assert.deepEqual(faces.mapBy('matches'), [[{
          person: this.person,
          distance: 7.89
        }]]);
      });
    });
    (0, _qunit.module)('FaceMatcher', function () {
      (0, _qunit.test)('it compares given descriptor with all candidates', async function (assert) {
        let person1 = {};
        let person2 = {};
        let person3 = {};

        let matcher = _faceDetector.FaceMatcher.create({
          candidates: [{
            person: person1,
            descriptors: [[1, 1, 1]]
          }, {
            person: person2,
            descriptors: [[2, 2, 2]]
          }, {
            person: person3,
            descriptors: [[3, 3, 3]]
          }]
        });

        let matches = matcher.match([1, 1, 1]);
        assert.equal(matches.length, 3);
        assert.deepEqual(matches.sortBy('distance').mapBy('person'), [person3, person2, person1]);
      });
    });
    (0, _qunit.module)('Face model', function () {
      (0, _qunit.test)('it crops image', async function (assert) {
        let box = {
          left: 12,
          top: 34,
          width: 56,
          height: 78
        };

        let face = _faceDetector.Face.create({
          detection: {
            detection: {
              box
            }
          },
          frame: document.createElement('canvas')
        });

        let offset = (56 + 78) / 2;
        assert.equal(face.box, box);
        assert.equal(face.image.width, 56 + offset);
        assert.equal(face.image.height, 78 + offset);
      });
      (0, _qunit.test)('it picks probable and confident matches', async function (assert) {
        const A = {
          distance: 0.9,
          person: 'A'
        };
        const B = {
          distance: 0.6,
          person: 'B'
        };
        const C = {
          distance: 0.1,
          person: 'C'
        };
        const D = {
          distance: 0.7,
          person: 'D'
        };

        let face = _faceDetector.Face.create({
          matches: [A, B, C, D]
        });

        assert.equal(face.confidentMatch, C);
        assert.deepEqual(face.probableMatches, [B, D]);
      });
      (0, _qunit.test)('it computes face size', async function (assert) {
        let box = {
          left: 12,
          top: 34,
          width: 56,
          height: 78
        };

        let face = _faceDetector.Face.create({
          detection: {
            detection: {
              box
            }
          }
        });

        assert.equal(face.size, 56 * 78);
      });
    });
  });
});
define("coffee-police/tests/unit/services/face-ranker-test", ["qunit", "ember-qunit", "sinon", "lolex"], function (_qunit, _emberQunit, _sinon, _lolex) {
  "use strict";

  (0, _qunit.module)('Unit | Service | face-ranker', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);
    const A = {
      person: 'A'
    };
    const B = {
      person: 'B'
    };
    const C = {
      person: 'C'
    };
    hooks.beforeEach(function () {
      let faceDetector = this.owner.lookup('service:face-detector');
      this.detectStub = _sinon.default.stub(faceDetector, 'detect').returns(Ember.RSVP.resolve([]));
      this.service = this.owner.lookup('service:face-ranker');
    });
    (0, _qunit.module)('time limits', function () {
      (0, _qunit.test)('it stops detecting after reaching upper time limit', function (assert) {
        this.clock = _lolex.default.install();
        Ember.run(() => {
          this.service.detect(1000, 3000);
        });
        assert.ok(this.detectStub.calledOnce);
        this.clock.tick(1500);
        assert.ok(this.detectStub.getCalls().length > 1);
        this.clock.tick(3000);
        this.detectStub.reset();
        this.detectStub.returns(Ember.RSVP.resolve([]));
        this.clock.tick(3001);
        assert.ok(this.detectStub.notCalled);
        this.clock.uninstall();
      });
      (0, _qunit.test)('it stops detecting when confident match is found after reaching lower time limit', function (assert) {
        this.clock = _lolex.default.install();
        this.detectStub.returns(Ember.RSVP.resolve([{
          confidentMatch: A
        }]));
        Ember.run(() => {
          this.service.detect(1000, 3000);
        });
        assert.ok(this.detectStub.calledOnce);
        this.clock.tick(500);
        assert.ok(this.detectStub.getCalls().length > 1);
        this.clock.tick(1000);
        this.detectStub.reset();
        this.detectStub.returns(Ember.RSVP.resolve([]));
        this.clock.tick(3000);
        assert.ok(this.detectStub.notCalled);
        this.clock.uninstall();
      });
    });
    (0, _qunit.module)('results combining', function () {
      (0, _qunit.test)('if confident, it returns single match', async function (assert) {
        this.detectStub.returns(Ember.RSVP.resolve([{
          confidentMatch: A
        }, {
          probableMatches: [B]
        }, {
          probableMatches: [B, C]
        }]));
        let result = await this.service.detect(0, 0);
        assert.deepEqual(result, 'A');
      });
      (0, _qunit.test)('if multiple confident faces found, it returns multiple matches', async function (assert) {
        this.detectStub.returns(Ember.RSVP.resolve([{
          confidentMatch: A
        }, {
          confidentMatch: B
        }, {
          confidentMatch: B
        }, {
          probableMatches: [B, C]
        }]));
        let results = await this.service.detect(0, 0);
        assert.deepEqual(results, ['A', 'B', 'C']);
      });
      (0, _qunit.test)('if no confident faces found, it returns probable matches', async function (assert) {
        this.detectStub.returns(Ember.RSVP.resolve([{
          probableMatches: [B]
        }, {
          probableMatches: [B, C]
        }]));
        let results = await this.service.detect(0, 0);
        assert.deepEqual(results, ['B', 'C']);
      });
      (0, _qunit.test)('if no confident or probable faces found, it returns null', async function (assert) {
        this.detectStub.returns(Ember.RSVP.resolve([{
          probableMatches: []
        }, {
          probableMatches: []
        }]));
        let results = await this.service.detect(0, 0);
        assert.equal(results, null);
      });
    });
    (0, _qunit.module)('sorting & filtering', function () {
      (0, _qunit.test)('it filters out small faces', async function (assert) {
        this.detectStub.returns(Ember.RSVP.resolve([{
          size: 100,
          confidentMatch: A
        }, {
          size: 80,
          confidentMatch: B
        }, {
          size: 50,
          confidentMatch: C
        }]));
        let results = await this.service.detect(0, 0);
        assert.deepEqual(results, ['A', 'B']);
      });
      (0, _qunit.test)('it sorts faces by distance', async function (assert) {
        this.detectStub.returns(Ember.RSVP.resolve([{
          probableMatches: [{
            person: 'A',
            distance: 0.7
          }, {
            person: 'B',
            distance: 0.6
          }]
        }, {
          probableMatches: [{
            person: 'A',
            distance: 0.1
          }, {
            person: 'B',
            distance: 0.5
          }]
        }]));
        let results = await this.service.detect(0, 0);
        assert.deepEqual(results, ['B', 'A']);
      });
      (0, _qunit.test)('it sorts faces by size', async function (assert) {
        this.detectStub.returns(Ember.RSVP.resolve([{
          size: 100,
          probableMatches: [{
            person: 'A',
            distance: 0.7
          }, {
            person: 'B',
            distance: 0.6
          }]
        }, {
          size: 80,
          probableMatches: [{
            person: 'A',
            distance: 0.1
          }, {
            person: 'B',
            distance: 0.5
          }]
        }]));
        let results = await this.service.detect(0, 0);
        assert.deepEqual(results, ['A', 'B']);
      });
    });
  });
});
define("coffee-police/tests/unit/services/webcam-test", ["qunit", "ember-qunit", "sinon", "coffee-police/tests/helpers/image"], function (_qunit, _emberQunit, _sinon, _image) {
  "use strict";

  (0, _qunit.module)('Unit | Service | webcam', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);
    hooks.beforeEach(function () {
      this.service = this.owner.lookup('service:webcam');
      this.stream = new MediaStream();
      this.mediaDevices = {
        getUserMedia: _sinon.default.stub().returns(Ember.RSVP.resolve(this.stream))
      };
      this.mediaDevicesStub = _sinon.default.stub(navigator, 'mediaDevices').value(this.mediaDevices);
    });
    hooks.afterEach(function () {
      this.mediaDevicesStub.restore();
    });
    (0, _qunit.test)('it detects lack of user media support', function (assert) {
      this.mediaDevices.getUserMedia = null;
      assert.notOk(this.service.isSupported);
      this.service.setup().then(() => assert.ok(false), error => assert.equal(error, 'This browser doesn’t support user media'));
    });
    (0, _qunit.test)('it retrieves video stream', async function (assert) {
      assert.ok(this.service.isSupported);
      assert.notOk(this.service.isReady);
      await this.service.setup().then(() => assert.ok(true), () => assert.ok(false));
      assert.ok(this.service.isReady);
      assert.equal(this.service.stream, this.stream);
      assert.ok(this.service.video.srcObject, this.stream);
    });
    (0, _qunit.test)('it plays video', async function (assert) {
      let setupSpy = _sinon.default.spy(this.service, 'setup');

      let play = _sinon.default.stub();

      let pause = _sinon.default.stub();

      this.service.reopen({
        video: Object.freeze({
          play,
          pause
        })
      });
      await this.service.start();
      assert.ok(setupSpy.calledOnce);
      assert.ok(play.calledOnce);
      assert.equal(this.service.isPlaying, true);
      await this.service.start();
      assert.ok(play.calledOnce);
      await this.service.stop();
      assert.ok(pause.calledOnce);
      assert.equal(this.service.isPlaying, false);
    });
    (0, _qunit.test)('it captures video frame', async function (assert) {
      let startSpy = _sinon.default.spy(this.service, 'start');

      let sourceImage = (0, _image.sampleVideo)();

      _sinon.default.stub(this.service, 'video').value(sourceImage);

      await this.service.getFrame().then(frame => {
        assert.equal(frame.toDataURL(), sourceImage.toDataURL());
      }, error => {
        assert.ok(false, error);
      });
      assert.ok(startSpy.calledOnce);
      assert.ok(sourceImage.play.calledOnce);
      assert.ok(sourceImage.pause.calledOnce);
    });
  });
});
define('coffee-police/config/environment', [], function() {
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

require('coffee-police/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
