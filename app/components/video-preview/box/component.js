import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import bemStates from 'coffee-police/utils/bem-states';

export default Component.extend(
  bemStates('isConfident'), {
  attributeBindings: ['style'],

  'data-test-box': true,

  box: reads('model.box'),

  style: computed('box.{left,top,width,height}', function() {
    return ['left', 'top', 'width', 'height'].map(
      (dim) => `${dim}: ${this.get(`box.${dim}`)}px`
    ).join('; ').htmlSafe();
  }),

  isConfident: computed('model.confidentMatch', function() {
    return !!this.model.confidentMatch;
  })
});
