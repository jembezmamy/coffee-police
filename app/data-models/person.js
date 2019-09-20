import { Model, attr } from 'ember-orbit';

export default Model.extend({
  name:   attr('string'),
  image:  attr('string')
});
