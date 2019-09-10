import Component from '@ember/component';
import { inject as service } from '@ember/service';
import DOMListener from 'coffee-police/utils/dom-listener';

export default Component.extend({
  tagName: 'video',
  webcam: service(),

  DOMListener,

  didInsertElement() {
    this._super(...arguments);
    this.webcam.promise.then(
      (stream) => this.element.srcObject = stream
    );
    this.DOMListener.add('loadedmetadata', this.autoPlay);
  },

  autoPlay() {
    this.element.play();
  }
});
