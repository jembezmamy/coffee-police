import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Component.extend({
  attributeBindings: ['style'],

  'data-test-box': true,

  box: reads('model.alignedRect.box'),

  style: computed('box.{left,top,width,height}', function() {
    return ['left', 'top', 'width', 'height'].map(
      (dim) => `${dim}: ${this.get(`box.${dim}`)}px`
    ).join('; ').htmlSafe();
  })
});
