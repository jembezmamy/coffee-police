import Service from '@ember/service';
import FaceAPI from 'face-api.js';
import { all } from 'rsvp';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';

export default Service.extend({
  webcam:       service(),

  isReady:      false,
  isDetecting:  false,

  setup() {
    return this.loadPromise = this.loadPromise || all(
      ['ssdMobilenetv1', 'faceRecognitionNet', 'faceLandmark68Net'].map(
        (net) => FaceAPI.nets[net].loadFromUri('/models')
      )
    ).then(
      () => this.set('isReady', true)
    );
  },

  start() {
    this.set('isDetecting', true);
    return this.detect();
  },

  stop() {
    this.set('isDetecting', false);
  },

  detect() {
    return this.setup().then(
      () => FaceAPI.detectAllFaces(this.webcam.video).withFaceLandmarks().withFaceDescriptors()
    ).then((faces) => {
      this.set('faces', faces);
      if (this.isDetecting) {
        next(this, this.detect);
      }
      return faces;
    });
  }
});
