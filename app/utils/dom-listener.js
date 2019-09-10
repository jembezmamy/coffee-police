import EmberObject, { computed } from '@ember/object';

export default computed(function() {
  return DOMListener.create({
    component: this
  });
})

const DOMListener = EmberObject.extend({

  init() {
    this._super(...arguments);
    this.component.on('willDestroyElement', this, this.removeAll);
  },

  listeners: computed(function() {
    return [];
  }),

  add(...args) {
    let [target, event, context, listener, useCapture] = normalizeArgs(this.component, args);
    let boundFunction = listener.bind(context);
    target.addEventListener(event, boundFunction, useCapture);
    this.listeners.push([target, event, context, listener, useCapture, boundFunction]);
  },

  remove(...args) {
    let [target, event, context, listener, useCapture] = normalizeArgs(this.component, args);
    let listeners = this.listeners.filter(([t,e,c,l,u]) => t === target && e === event && c === context && l === listener && u === useCapture);
    let boundFunction = listeners[0] ? listeners[0][5] : listener;
    target.removeEventListener(event, boundFunction, useCapture);
    this.listeners.removeObjects(listeners);
  },

  removeAll() {
    this.listeners.slice().forEach(([t,e,c,l,u]) => this.remove(t,e,c,l,u));
  }
});

function normalizeArgs(component, args) {
  let target, event, listener, useCapture;
  let context = component;
  if (typeof args[args.length - 1] === 'boolean') {
    useCapture = args.pop();
  } else {
    useCapture = false;
  }
  switch (args.length) {
    case 4:
      [target, event, context, listener] = args;
      break;
    case 3:
      if (typeof args[1] !== 'string') {
        [event, context, listener] = args;
      } else {
        [target, event, listener] = args;
      }
      break;
    default:
      [event, listener] = args;
  }
  if (typeof target === 'string') {
    target = component.element.querySelector(target);
  } else if (!target) {
    target = component.element;
  }
  return [target, event, context, listener, useCapture];
}
