import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { dasherize, classify } from '@ember/string';

export default function (...flags) {
  let options = {};
  if (typeof flags[0] === 'object') {
    options = flags.shift();
  }

  let classNameBindings = []

  let object = {
    bemNamespace: reads('styleNamespace')
  };

  flags.forEach((flag) => {
    let classAttribute = `${flag}Class`;
    if (options.element) {
      classAttribute = [options.element, classify(classAttribute)].join('');
    }
    object[classAttribute] = computed(flag, 'bemNamespace', function () {
      let state = dasherize(flag.replace(/^(is|has)/, ''));
      let not = flag.match(/^has/) ? 'no' : 'not';
      let value = this.get(flag);
      if (['string', 'number'].includes(typeof value)) {
        value = String(value);
        state = [state, dasherize(value)].join('-');
      }
      return [
        [this.bemNamespace, options.element].compact().join('__'),
        value ? state : [not, state].join('-')
      ].join('--');
    });
    classNameBindings.push(classAttribute);
  });

  if (options.element) {
    let elementClassAttribute = `${options.element}Class`;
    object[elementClassAttribute] = computed(...classNameBindings, 'bemNamespace', function() {
      return [
        `${this.bemNamespace}__${options.element}`,
        ...classNameBindings.map(
          (name) => this.get(name)
        )
      ].join(' ');
    })
  } else {
    object.classNameBindings = classNameBindings.concat(['bemNamespace']);
  }

  return object;
}
