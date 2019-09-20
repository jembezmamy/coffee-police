import Service from '@ember/service';
import FaceAPI from 'face-api.js';
import { all } from 'rsvp';
import { inject as service } from '@ember/service';
import { next, cancel } from '@ember/runloop';
import EmberObject, { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

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
      (frame) => this.FaceAPI.detectAllFaces(frame).withFaceLandmarks().withFaceDescriptors().then(
        (faces) => this.set('faces', faces.map(
          (detection) => Face.create({ frame, detection })
        ))
      )
    ).then((faces) => {
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

export const Face = EmberObject.extend({
  box: reads('detection.detection.box'),

  image: computed('box', 'frame', function() {
    let canvas = document.createElement('canvas');
    canvas.width = this.box.width;
    canvas.height = this.box.height;
    canvas.getContext('2d').drawImage(
      this.frame,
      this.box.left, this.box.top, this.box.width, this.box.height,
      0, 0, this.box.width, this.box.height
    );
    return canvas;
  })
});
