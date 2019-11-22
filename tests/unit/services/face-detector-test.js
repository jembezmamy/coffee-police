import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { settled } from '@ember/test-helpers';
import sinon from 'sinon';
import { resolve } from 'rsvp';
import { next } from '@ember/runloop';
import { Face, FaceMatcher } from 'coffee-police/services/face-detector';

module('Unit | Service | face-detector', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.frame = document.createElement('canvas');
    this.getFrame = sinon.stub(this.owner.lookup('service:webcam'), 'getFrame').returns(resolve(this.frame));

    this.detectionStub = sinon.stub().returns(resolve([]));
    this.FaceAPIStub = {
      nets: {
        ssdMobilenetv1:     { loadFromUri: sinon.stub().returns(resolve()) },
        faceRecognitionNet: { loadFromUri: sinon.stub().returns(resolve()) },
        faceLandmark68Net:  { loadFromUri: sinon.stub().returns(resolve()) }
      },
      detectAllFaces: sinon.stub().returns({
        withFaceLandmarks: sinon.stub().returns({
          withFaceDescriptors: this.detectionStub,
        })
      }),
      detectSingleFace: sinon.stub().returns({
        withFaceLandmarks: sinon.stub().returns({
          withFaceDescriptor: sinon.stub().returns({ descriptor: [1,2,3] }),
        })
      })
    };
    this.service = this.owner.lookup('service:face-detector');
    this.service.FaceAPI = this.FaceAPIStub;
  });

  module('face detection', function(hooks) {
    hooks.beforeEach(function() {
      this.faces = [{}, {}, {}];
      this.detectionStub.returns(resolve(this.faces));
    });

    test('it loads models', async function(assert) {
      await this.service.setup().then(
        () => assert.ok(true),
        () => assert.ok(false)
      );

      assert.ok(this.FaceAPIStub.nets.ssdMobilenetv1.loadFromUri.calledOnce);
      assert.ok(this.FaceAPIStub.nets.faceRecognitionNet.loadFromUri.calledOnce);
      assert.ok(this.FaceAPIStub.nets.faceLandmark68Net.loadFromUri.calledOnce);
    });

    test('it detects faces', async function(assert) {
      let setupSpy = sinon.spy(this.service, 'setup');

      await this.service.detect().then(
        (faces) => assert.equal(faces.length, this.faces.length),
        () => assert.ok(false)
      );

      assert.ok(setupSpy.called);
      assert.ok(this.getFrame.calledOnce);
      assert.equal(this.FaceAPIStub.detectAllFaces.getCall(0).args[0], this.frame);
      assert.deepEqual(this.service.faces.mapBy('detection'), this.faces);
    });

    test('it runs in loop', async function(assert) {
      let detectSpy = sinon.spy(this.service, 'detect');

      await this.service.start();

      assert.ok(detectSpy.calledOnce);

      next(() => {
        assert.ok(detectSpy.calledTwice);
        this.service.stop();
      });

      await settled();

      assert.ok(detectSpy.calledTwice);
    });
  });


  module('face recognition', function(hooks) {
    hooks.beforeEach(async function() {
      let store = this.owner.lookup('service:store');
      this.person = await store.addRecord({ type: 'person', name: 'John', image: '/images/face-1.jpg' });
      this.detectionStub.returns(resolve([{
        descriptor: [5,6,7]
      }]));
    });

    test('it defines face matcher', async function(assert) {
      let matcher = await this.service.faceMatcher;

      assert.equal(this.FaceAPIStub.detectSingleFace.getCall(0).args[0].src, `${location.origin}/images/face-1.jpg`);
      assert.ok(matcher instanceof FaceMatcher);
      assert.deepEqual(matcher.candidates, [
        { descriptors: [[1,2,3]], person: this.person }
      ]);
    });

    test('it performs face match for each face', async function(assert) {
      await this.service.setup();
      let matcher = await this.service.faceMatcher;
      sinon.stub(matcher, 'computeMeanDistance').returns(7.89);
      let matchSpy = sinon.spy(matcher, 'match');
      let faces = await this.service.detect();

      assert.deepEqual(matchSpy.getCall(0).args[0], [5,6,7]);
      assert.deepEqual(faces.mapBy('matches'), [
        [{
          person: this.person,
          distance: 7.89
        }]
      ]);
    });
  });

  module('FaceMatcher', function() {
    test('it compares given descriptor with all candidates', async function(assert) {
      let person1 = {};
      let person2 = {};
      let person3 = {};
      let matcher = FaceMatcher.create({
        candidates: [
          { person: person1, descriptors: [[1,1,1]]},
          { person: person2, descriptors: [[2,2,2]]},
          { person: person3, descriptors: [[3,3,3]]}
        ]
      });

      let matches = matcher.match([1,1,1]);

      assert.equal(matches.length, 3);
      assert.deepEqual(matches.sortBy('distance').mapBy('person'), [person3, person2, person1]);
    });
  })

  module('Face model', function() {
    test('it crops image', async function(assert) {
      let box = {
        left:   12,
        top:    34,
        width:  56,
        height: 78
      };
      let face = Face.create({
        detection: { detection: { box }},
        frame: document.createElement('canvas')
      });

      let offset = (56 + 78) / 2;
      assert.equal(face.box, box);
      assert.equal(face.image.width, 56 + offset);
      assert.equal(face.image.height, 78 + offset);
    });
  });
});
