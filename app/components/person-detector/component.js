import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  faceRanker: service(),

  actions: {
    detect() {
      this.setProperties({
        isDetecting: true,
        didDetect: false,
        results: null
      });
      this.faceRanker.detect(1000, 3000).then(
        (results) => this.set('results', results && results.length ? results.slice(0, 3) : results)
      ).finally(
        () => this.setProperties({
          isDetecting: false,
          didDetect: true
        })
      )
    }
  }
});
