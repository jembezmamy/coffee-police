import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | face-detector', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let service = this.owner.lookup('service:face-detector');
    assert.ok(service);
  });
});
