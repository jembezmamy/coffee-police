import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),

  didInsertElement() {
    this._super(...arguments);
    this.store.liveQuery(q => q.findRecords('person')).then(
      (people) => this.set('people', people)
    );
  }
});
