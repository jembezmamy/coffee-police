import Service from '@ember/service';
import { computed } from '@ember/object';
import { reject } from 'rsvp';

export default Service.extend({
  stream:     null,
  isReady:    false,
  isPlaying:  false,

  isSupported: computed(function() {
    return navigator.mediaDevices && navigator.mediaDevices.getUserMedia
  }),

  setup() {
    return this.setupPromise = this.setupPromise || (
      this.isSupported ? navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      }) : reject('This browser doesn’t support user media')
    ).then(
      (stream) => this.setProperties({
        stream,
        isReady: true
      })
    );
  },

  start() {
    return this.setup().then(() => {
      if (!this.isPlaying) {
        this.video.play();
        this.set('isPlaying', true);
      }
    });
  },

  stop() {
    if (this.isPlaying) {
      this.video.pause();
      this.set('isPlaying', false);
    }
  },

  getFrame() {
    let wasPlaying = this.isPlaying;
    return this.start().then(() => {
      let canvas = document.createElement('canvas');
      canvas.width = this.video.videoWidth;
      canvas.height = this.video.videoHeight;
      canvas.getContext('2d').drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight);
      if (!wasPlaying) {
        this.stop();
      }
      return canvas;
    });
  },

  video: computed('stream', function() {
    let video =  document.createElement('video');
    video.srcObject = this.stream;
    return video;
  })
});
