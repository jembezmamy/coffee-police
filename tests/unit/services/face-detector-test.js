import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { settled } from '@ember/test-helpers';
import sinon from 'sinon';
import { resolve } from 'rsvp';
import { next } from '@ember/runloop';

module('Unit | Service | face-detector', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.frame = document.createElement('canvas');
    this.getFrame = sinon.stub(this.owner.lookup('service:webcam'), 'getFrame').returns(resolve(this.frame));
    this.faces = [];
    this.FaceAPIStub = {
      nets: {
        ssdMobilenetv1:     { loadFromUri: sinon.stub().returns(resolve()) },
        faceRecognitionNet: { loadFromUri: sinon.stub().returns(resolve()) },
        faceLandmark68Net:  { loadFromUri: sinon.stub().returns(resolve()) }
      },
      detectAllFaces: sinon.stub().returns({
        withFaceLandmarks: sinon.stub().returns({
          withFaceDescriptors: sinon.stub().returns(resolve(this.faces))
        })
      })
    };
    this.service = this.owner.lookup('service:face-detector');
    this.service.FaceAPI = this.FaceAPIStub;
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
      (faces) => assert.equal(faces, this.faces),
      () => assert.ok(false)
    );

    assert.ok(setupSpy.calledOnce);
    assert.ok(this.getFrame.calledOnce);
    assert.equal(this.FaceAPIStub.detectAllFaces.getCall(0).args[0], this.frame);
    assert.equal(this.service.faces, this.faces);
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
