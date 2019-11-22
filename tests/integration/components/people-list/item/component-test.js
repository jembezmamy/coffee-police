import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration | Component | people-list/item', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function() {
    this.model = {
      id: 242,
      name: 'Sofia',
      image: '/images/face-1.jpg',
      remove: sinon.stub()
    };
    await render(hbs`{{people-list/item model=model}}`);
  });

  test('it renders', async function(assert) {
    assert.dom('[data-test-person]').exists();
    assert.dom(this.element).includesText('Sofia');
    assert.dom('img').hasAttribute('src', /face-1.jpg/);
  });

  test('it removes records', async function(assert) {
    await click('button[name="removePerson[242]"]');

    assert.ok(this.model.remove.calledOnce);
  });
});
