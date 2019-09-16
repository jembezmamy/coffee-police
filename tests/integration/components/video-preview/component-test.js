import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';
import { resolve } from 'rsvp';
import sinon from 'sinon';

module('Integration | Component | video-preview', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function() {
    this.stream = new MediaStream();
    this.webcamStart = sinon.stub().returns(resolve());
    this.owner.register('service:webcam', EmberObject.extend({
      start: this.webcamStart,
      stream: this.stream
    }));
    this.faceDetectorStart = sinon.stub().returns(resolve());
    this.owner.register('service:face-detector', EmberObject.extend({
      start: this.faceDetectorStart,
      faces: Object.freeze([{}, {}])
    }));

    await render(hbs`<VideoPreview />`);
  });

  test('it displays video from the webcam service', async function(assert) {
    let video = this.element.querySelector('video');

    assert.ok(this.webcamStart.calledOnce);
    assert.equal(video.srcObject, this.stream);
  });

  test('it displays faces from the face detector service', async function(assert) {
    assert.ok(this.faceDetectorStart.calledOnce);
    assert.dom('[data-test-box]').exists({ count: 2 });
  });
});
