import EmberObject from '@ember/object';
import Evented from '@ember/object/evented';
import DOMListener from 'coffee-police/utils/dom-listener';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Util | dom-listener', function() {

  const Component = EmberObject.extend(Evented, {
    DOMListener
  });

  test('it defines a computed macro', function(assert) {
    let component = Component.create();

    assert.ok(component.DOMListener.add);
    assert.ok(component.DOMListener.remove);
  });

  test('it adds event listeners', function (assert) {
    let addEventListener = sinon.stub();
    let child = { addEventListener };

    let querySelector = sinon.stub().returns(child);
    let element = { addEventListener, querySelector };

    let clickHandler = () => {};

    let subject = Component.create({ element }).DOMListener;

    // event, handler
    subject.add('click', clickHandler);

    assert.equal(addEventListener.getCall(0).args[0], 'click');
    assert.equal(addEventListener.getCall(0).args[2], false);

    addEventListener.reset();

    // event, handler, useCapture
    subject.add('click', clickHandler, true);

    assert.equal(addEventListener.getCall(0).args[0], 'click');
    assert.equal(addEventListener.getCall(0).args[2], true);

    addEventListener.reset();

    // event, context, handler
    subject.add('click', subject, clickHandler);

    assert.equal(addEventListener.getCall(0).args[0], 'click');
    assert.equal(addEventListener.getCall(0).args[2], false);

    addEventListener.reset();

    // event, context, handler, useCapture
    subject.add('click', subject, clickHandler, true);

    assert.equal(addEventListener.getCall(0).args[0], 'click');
    assert.equal(addEventListener.getCall(0).args[2], true);

    addEventListener.reset();

    // target, event, handler
    subject.add('input', 'click', clickHandler);

    assert.equal(querySelector.getCall(0).args[0], 'input');
    assert.equal(addEventListener.getCall(0).args[0], 'click');
    assert.equal(addEventListener.getCall(0).args[2], false);

    addEventListener.reset();
    querySelector.reset();
    querySelector.returns(child);

    // target, event, handler, useCapture
    subject.add('input', 'click', clickHandler, true);

    assert.equal(querySelector.getCall(0).args[0], 'input');
    assert.equal(addEventListener.getCall(0).args[0], 'click');
    assert.equal(addEventListener.getCall(0).args[2], true);

    addEventListener.reset();
    querySelector.reset();
    querySelector.returns(child);

    // target, event, context, handler
    subject.add('input', 'click', subject, clickHandler);

    assert.equal(querySelector.getCall(0).args[0], 'input');
    assert.equal(addEventListener.getCall(0).args[0], 'click');
    assert.equal(addEventListener.getCall(0).args[2], false);

    addEventListener.reset();
    querySelector.reset();
    querySelector.returns(child);

    // target, event, context, handler, useCapture
    subject.add('input', 'click', subject, clickHandler, true);

    assert.equal(querySelector.getCall(0).args[0], 'input');
    assert.equal(addEventListener.getCall(0).args[0], 'click');
    assert.equal(addEventListener.getCall(0).args[2], true);

  });

  test('it removes event listeners', function (assert) {
    let removeEventListener = sinon.stub();
    let child = { removeEventListener };

    let querySelector = sinon.stub().returns(child);
    let element = { removeEventListener, querySelector };

    let clickHandler = () => {};

    let subject = Component.create({ element }).DOMListener;

    // event, handler
    subject.remove('click', clickHandler);

    assert.equal(removeEventListener.getCall(0).args[0], 'click');
    assert.equal(removeEventListener.getCall(0).args[2], false);

    removeEventListener.reset();

    // event, handler, useCapture
    subject.remove('click', clickHandler, true);

    assert.equal(removeEventListener.getCall(0).args[0], 'click');
    assert.equal(removeEventListener.getCall(0).args[2], true);

    removeEventListener.reset();

    // event, context, handler
    subject.remove('click', subject, clickHandler);

    assert.equal(removeEventListener.getCall(0).args[0], 'click');
    assert.equal(removeEventListener.getCall(0).args[2], false);

    removeEventListener.reset();

    // event, context, handler, useCapture
    subject.remove('click', subject, clickHandler, true);

    assert.equal(removeEventListener.getCall(0).args[0], 'click');
    assert.equal(removeEventListener.getCall(0).args[2], true);

    removeEventListener.reset();

    // target, event, handler
    subject.remove('input', 'click', clickHandler);

    assert.equal(querySelector.getCall(0).args[0], 'input');
    assert.equal(removeEventListener.getCall(0).args[0], 'click');
    assert.equal(removeEventListener.getCall(0).args[2], false);

    removeEventListener.reset();
    querySelector.reset();
    querySelector.returns(child);

    // target, event, handler, useCapture
    subject.remove('input', 'click', clickHandler, true);

    assert.equal(querySelector.getCall(0).args[0], 'input');
    assert.equal(removeEventListener.getCall(0).args[0], 'click');
    assert.equal(removeEventListener.getCall(0).args[2], true);

    removeEventListener.reset();
    querySelector.reset();
    querySelector.returns(child);

    // target, event, context, handler
    subject.remove('input', 'click', subject, clickHandler);

    assert.equal(querySelector.getCall(0).args[0], 'input');
    assert.equal(removeEventListener.getCall(0).args[0], 'click');
    assert.equal(removeEventListener.getCall(0).args[2], false);

    removeEventListener.reset();
    querySelector.reset();
    querySelector.returns(child);

    // target, event, context, handler, useCapture
    subject.remove('input', 'click', subject, clickHandler, true);

    assert.equal(querySelector.getCall(0).args[0], 'input');
    assert.equal(removeEventListener.getCall(0).args[0], 'click');
    assert.equal(removeEventListener.getCall(0).args[2], true);
  });

  test('it removes all listeners on component removal', function (assert) {
    let addEventListener = sinon.stub();
    let removeEventListener = sinon.stub();
    let child = { addEventListener, removeEventListener };

    let querySelector = sinon.stub().returns(child);
    let element = { addEventListener, removeEventListener, querySelector };

    let clickHandler = () => {};

    let component = Component.create({ element });
    let subject = component.DOMListener;

    subject.add('click', clickHandler);
    subject.add('click', subject, clickHandler);
    subject.add('input', 'click', clickHandler);
    subject.add('input', 'click', subject, clickHandler);
    component.trigger('willDestroyElement');

    assert.deepEqual(removeEventListener.getCall(0).args[0], 'click');
    assert.deepEqual(removeEventListener.getCall(1).args[0], 'click');
    assert.deepEqual(removeEventListener.getCall(2).args[0], 'click');
    assert.deepEqual(removeEventListener.getCall(3).args[0], 'click');
  });
});
