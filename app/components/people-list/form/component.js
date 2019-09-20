import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: 'form',
  'data-test-person-form': true,

  faceDetector: service(),
  store: service(),

  actions: {
    submit() {
      this.faceDetector.detect().then((faces) => {
        if (faces[0]) {
          return this.store.addRecord({
            type: 'person',
            name: this.name,
            image: faces[0].image.toDataURL()
          });
        } else {
          throw 'no face detected';
        }
      }).then(
        () => this.set('name', '')
      );
    }
  }
});
