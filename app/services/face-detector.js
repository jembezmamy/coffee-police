import Service from '@ember/service';
import FaceAPI from 'face-api.js';
import { all } from 'rsvp';
import { inject as service } from '@ember/service';
import { next, cancel } from '@ember/runloop';

export default Service.extend({
  webcam:       service(),

  FaceAPI,

  isReady:      false,
  isDetecting:  false,

  setup() {
    return this.loadPromise = this.loadPromise || all(
      ['ssdMobilenetv1', 'faceRecognitionNet', 'faceLandmark68Net'].map(
        (net) => this.FaceAPI.nets[net].loadFromUri('/models')
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
      () => this.webcam.getFrame()
    ).then(
      (frame) => this.FaceAPI.detectAllFaces(frame).withFaceLandmarks().withFaceDescriptors()
    ).then((faces) => {
      this.set('faces', faces);
      if (this.isDetecting) {
        this.nextRun = next(this, this.detect);
      }
      return faces;
    });
  },

  willDestroy() {
    this._super(...arguments);
    cancel(this.nextRun);
  }
});
