import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: 'form',
  'data-test-person-form': true,

  store: service(),

  actions: {
    submit() {
      this.store.addRecord({
        type: 'person',
        name: this.name
      }).then(
        () => this.set('name', '')
      );
    }
  }
});
