import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';
import { Promise, resolve } from 'rsvp';
import finishRender from 'coffee-police/tests/helpers/finish-render';

module('Integration | Component | person-detector', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function() {
    this.detectStub = sinon.stub(this.owner.lookup('service:face-ranker'), 'detect');
    await render(hbs`<PersonDetector />`);
  });

  test('it calls detect() and waits for results', async function(assert) {
    let resolvePromise;
    this.detectStub.returns(new Promise((r) => resolvePromise = r));

    click('button[name=detect]');
    await finishRender();

    assert.dom('button[name=detect]').isDisabled();

    resolvePromise();
    await settled();

    assert.dom('button[name=detect]').isNotDisabled();
  });

  test('it renders confident match', async function(assert) {
    this.detectStub.returns(resolve(
      { name: 'Camryn Klocko' }
    ));

    await click('button[name=detect]');
    await finishRender();

    assert.dom(this.element).includesText('Hi, Camryn Klocko');
  });

  test('it renders probable matches', async function(assert) {
    this.detectStub.returns(resolve([
      { name: 'Camryn Klocko' },
      { name: 'William Farrell' },
      { name: 'Paige McDermott' },
      { name: 'Rhea Johnston' },
      { name: 'Dr. Dorcas Legros' }
    ]));

    await click('button[name=detect]');
    await finishRender();

    assert.dom(this.element).includesText('Hi, Camryn Klocko, William Farrell, Paige McDermott, or someone else...?');
    assert.dom(this.element).doesNotIncludeText('Rhea Johnston');
    assert.dom(this.element).doesNotIncludeText('Dr. Dorcas Legros');
  });

  test('it renders no-match', async function(assert) {
    this.detectStub.returns(resolve());

    await click('button[name=detect]');
    await finishRender();

    assert.dom(this.element).includesText('Do we know each other...?');
  });
});
