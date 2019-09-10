import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';
import { resolve } from 'rsvp';

module('Integration | Component | video-preview', function(hooks) {
  setupRenderingTest(hooks);

  test('it displays video from the webcam service', async function(assert) {
    let stream = new MediaStream();
    this.owner.register('service:webcam', EmberObject.extend({
      promise: resolve(stream)
    }));

    await render(hbs`<VideoPreview />`);

    let video = this.element.querySelector('video');

    assert.equal(video.srcObject, stream);
  });
});
