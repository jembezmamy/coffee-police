import Service from '@ember/service';
import { computed } from '@ember/object';
import { reject } from 'rsvp';

export default Service.extend({
  stream:   null,
  isReady:  false,

  isSupported: computed(function() {
    return navigator.mediaDevices && navigator.mediaDevices.getUserMedia
  }),

  setup() {
    return (
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
    return this.setup().then(
      () => this.video.play()
    );
  },

  stop() {
    this.video.pause();
  },

  video: computed('stream', function() {
    let video =  document.createElement('video');
    video.srcObject = this.stream;
    return video;
  })
});
