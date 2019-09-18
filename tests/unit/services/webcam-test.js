import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import { resolve } from 'rsvp';
import { sampleVideo } from 'coffee-police/tests/helpers/image';

module('Unit | Service | webcam', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.service = this.owner.lookup('service:webcam');
    this.stream = new MediaStream();
    this.mediaDevices = {
      getUserMedia: sinon.stub().returns(resolve(this.stream))
    };
    this.mediaDevicesStub = sinon.stub(navigator, 'mediaDevices').value(this.mediaDevices);
  });

  hooks.afterEach(function() {
    this.mediaDevicesStub.restore();
  });

  test('it detects lack of user media support', function(assert) {
    this.mediaDevices.getUserMedia = null;

    assert.notOk(this.service.isSupported);

    this.service.setup().then(
      () => assert.ok(false),
      (error) => assert.equal(error, 'This browser doesn’t support user media')
    );
  });

  test('it retrieves video stream', async function(assert) {
    assert.ok(this.service.isSupported);
    assert.notOk(this.service.isReady);

    await this.service.setup().then(
      () => assert.ok(true),
      () => assert.ok(false)
    );

    assert.ok(this.service.isReady);
    assert.equal(this.service.stream, this.stream);
    assert.ok(this.service.video.srcObject, this.stream);
  });

  test('it plays video', async function(assert) {
    let setupSpy = sinon.spy(this.service, 'setup');
    let play = sinon.stub();
    let pause = sinon.stub();
    this.service.reopen({
      video: Object.freeze({  play, pause })
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

  test('it captures video frame', async function(assert) {
    let startSpy = sinon.spy(this.service, 'start');
    let sourceImage = sampleVideo();
    sinon.stub(this.service, 'video').value(sourceImage);

    await this.service.getFrame().then((frame) => {
      assert.equal(frame.toDataURL(), sourceImage.toDataURL());
    }, (error) => {
      assert.ok(false, error);
    });

    assert.ok(startSpy.calledOnce);
    assert.ok(sourceImage.play.calledOnce);
    assert.ok(sourceImage.pause.calledOnce);
  });
});
