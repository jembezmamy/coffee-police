import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({

  webcam: service(),
  faceDetector: service(),

  didInsertElement() {
    this._super(...arguments);
    this.webcam.start().then(
      () => this.faceDetector.start()
    ).then(
      () => this.element.querySelector('video').srcObject = this.webcam.stream
    );
  }
});
