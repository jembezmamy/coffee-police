import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration | Component | people-list/form', function(hooks) {
  setupRenderingTest(hooks);

  test('it creates new people', async function(assert) {
    let store = this.owner.lookup('service:store');
    let addRecord = sinon.spy(store, 'addRecord');

    await render(hbs`{{people-list/form}}`);

    assert.dom('[data-test-person-form]').exists();
    assert.dom('input[type=submit]').isDisabled();

    await fillIn('input[name="person[name]"]', 'John');
    await click('input[type=submit]');

    assert.deepEqual(addRecord.getCall(0).args[0], { type: 'person', name: 'John' });

    assert.dom('input[name="person[name]"]').hasValue('');
    assert.dom('input[type=submit]').isDisabled();
  });
});
