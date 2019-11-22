import Service from '@ember/service';
import FaceAPI from 'face-api.js';
import { Promise, all, hash } from 'rsvp';
import { inject as service } from '@ember/service';
import { next, cancel } from '@ember/runloop';
import EmberObject, { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';

const CONFIDENCE_THRESHOLD = 0.5;

const ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

export default Service.extend({
  webcam:       service(),
  store:        service(),

  FaceAPI,

  isReady:      false,
  isDetecting:  false,

  setup() {
    return this.loadPromise = this.loadPromise || all(
      ['ssdMobilenetv1', 'faceRecognitionNet', 'faceLandmark68Net'].map(
        (net) => this.FaceAPI.nets[net].loadFromUri('/models')
      )
    ).then(
      () => this.store.liveQuery(q => q.findRecords('person')).then(
        (people) => this.set('people', people)
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
      () => hash({
        frame: this.webcam.getFrame(),
        faceMatcher: this.faceMatcher
      })
    ).then(
      ({ frame, faceMatcher }) => this.FaceAPI.detectAllFaces(frame).withFaceLandmarks().withFaceDescriptors().then(
        (faces) => this.set('faces', faces.map(
          (detection) => Face.create({
            frame, detection,
            matches: faceMatcher.match(detection.descriptor)
          })
        ))
      )
    ).then((faces) => {
      if (this.isDetecting) {
        this.nextRun = next(this, this.detect);
      }
      return faces;
    });
  },

  faceMatcher: computed('people.[]', function() {
    let promise = this.setup().then(
      () => all(this.people.map(
        (person) => loadImage(person.image).then(
          (img) => this.FaceAPI.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        ).then(
          (result) => result ? {
              person,
              descriptors: [result.descriptor]
            } : null
        )
      )).then(
        (results) => FaceMatcher.create({
          candidates: results.compact()
        })
      )
    );
    return ObjectPromiseProxy.create({ promise });
  }),

  willDestroy() {
    this._super(...arguments);
    cancel(this.nextRun);
  }
});

export const FaceMatcher = EmberObject.extend({
  match(queryDescriptor) {
    return this.candidates.map(
      (candidate) => ({
        person: candidate.person,
        distance: this.computeMeanDistance(queryDescriptor, candidate.descriptors)
      })
    );
  },

  computeMeanDistance(queryDescriptor, descriptors) {
    return descriptors
      .map(d => FaceAPI.euclideanDistance(d, queryDescriptor))
      .reduce((d1, d2) => d1 + d2, 0)
        / (descriptors.length || 1);
  }
});

export const Face = EmberObject.extend({
  box: reads('detection.detection.box'),

  image: computed('box', 'frame', function() {
    let canvas = document.createElement('canvas');
    let box = expand(this.box, this.frame, (this.box.width + this.box.height) / 4);
    canvas.width = box.width;
    canvas.height = box.height;
    canvas.getContext('2d').drawImage(
      this.frame,
      box.left, box.top, box.width, box.height,
      0, 0, box.width, box.height
    );
    return canvas;
  }),

  confidentMatch: computed('matches', function() {
    let matched = this.matches.filter(
      (m) => m.distance < CONFIDENCE_THRESHOLD
    );
    return matched.length === 1 ? matched[0].person : null;
  })
});

function expand(box, limits, amount) {
  let expanded = {
    left: Math.max(0, box.left - amount),
    top:  Math.max(0, box.top - amount)
  };
  expanded.width  = Math.min(limits.width - expanded.left, box.width  + amount * 2);
  expanded.height = Math.min(limits.height - expanded.top, box.height + amount * 2);
  return expanded;
}

function loadImage(src) {
  return new Promise((resolve) => {
    let img = document.createElement('img');
    img.onload = () => resolve(img);
    img.src = src;
  });
}
