import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | video-preview/box', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.model = {
      alignedRect: {
        box: {
          left:   12,
          top:    34,
          width:  56,
          height: 78
        }
      }
    };

    await render(hbs`{{video-preview/box model=model}}`);

    assert.dom('[data-test-box]').hasAttribute('style', /left: 12px/);
    assert.dom('[data-test-box]').hasAttribute('style', /top: 34px/);
    assert.dom('[data-test-box]').hasAttribute('style', /width: 56px/);
    assert.dom('[data-test-box]').hasAttribute('style', /height: 78px/);
  });
});
