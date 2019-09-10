import Service from '@ember/service';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { reject } from 'rsvp';
import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';

const ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

export default Service.extend({
  stream:   reads('promise.content'),
  isReady:  reads('promise.isFulfilled'),

  isSupported: computed(function() {
    return navigator.mediaDevices && navigator.mediaDevices.getUserMedia
  }),

  promise: computed(function() {
    return ObjectPromiseProxy.create({
      promise: this.isSupported ? navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      }) : reject('This browser doesn’t support user media')
    });
  })
});
