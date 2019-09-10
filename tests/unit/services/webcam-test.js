import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import { resolve } from 'rsvp';

module('Unit | Service | webcam', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.service = this.owner.lookup('service:webcam');
    this.stream = {};
    this.mediaDevices = {
      getUserMedia: sinon.stub().returns(resolve(this.stream))
    };
    this.mediaDevicesStub = sinon.stub(navigator, 'mediaDevices').value(this.mediaDevices);
  });

  hooks.afterEach(function() {
    this.mediaDevicesStub.restore();
  });

  test('it retrieves video stream', async function(assert) {
    assert.ok(this.service.isSupported);
    assert.notOk(this.service.isReady);

    await this.service.promise.then(
      (stream) => assert.equal(stream, this.stream),
      () => assert.ok(false)
    );

    assert.ok(this.service.isReady);
    assert.equal(this.service.stream, this.stream);
  });

  test('it detects lack of user media support', function(assert) {
    this.mediaDevices.getUserMedia = null;

    assert.notOk(this.service.isSupported);

    this.service.promise.then(
      () => assert.ok(false),
      (error) => assert.equal(error, 'This browser doesn’t support user media')
    );
  });
});
