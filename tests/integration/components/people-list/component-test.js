import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | people-list', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    let store = this.owner.lookup('service:store');
    await store.addRecord({ type: 'person', name: 'John' });
    await store.addRecord({ type: 'person', name: 'Kate' });

    await render(hbs`<PeopleList />`);

    assert.dom('[data-test-person-form]').exists();
    assert.dom('[data-test-person]').exists({ count: 2 });
  });
});
