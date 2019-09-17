import Component from '@ember/component';

export default Component.extend({
  'data-test-person': true,

  actions: {
    remove() {
      this.model.remove();
    }
  }
});
