import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import { resolve } from 'rsvp';
import lolex from 'lolex';
import { run } from '@ember/runloop';

module('Unit | Service | face-ranker', function(hooks) {
  setupTest(hooks);

  const A = { person: 'A' };
  const B = { person: 'B' };
  const C = { person: 'C' };

  hooks.beforeEach(function() {
    let faceDetector = this.owner.lookup('service:face-detector');
    this.detectStub = sinon.stub(faceDetector, 'detect').returns(resolve([]));
    this.service = this.owner.lookup('service:face-ranker');
  });

  module('time limits', function() {
    test('it stops detecting after reaching upper time limit', function(assert) {
      this.clock = lolex.install();

      run(() => {
        this.service.detect(1000, 3000);
      });

      assert.ok(this.detectStub.calledOnce);

      this.clock.tick(1500);

      assert.ok(this.detectStub.getCalls().length > 1);

      this.clock.tick(3000);
      this.detectStub.reset();
      this.detectStub.returns(resolve([]));
      this.clock.tick(3001);

      assert.ok(this.detectStub.notCalled);

      this.clock.uninstall();
    });

    test('it stops detecting when confident match is found after reaching lower time limit', function(assert) {
      this.clock = lolex.install();
      this.detectStub.returns(resolve(
        [{ confidentMatch: A }]
      ));

      run(() => {
        this.service.detect(1000, 3000);
      });

      assert.ok(this.detectStub.calledOnce);

      this.clock.tick(500);

      assert.ok(this.detectStub.getCalls().length > 1);

      this.clock.tick(1000);
      this.detectStub.reset();
      this.detectStub.returns(resolve([]));
      this.clock.tick(3000);

      assert.ok(this.detectStub.notCalled);

      this.clock.uninstall();
    });
  });

  module('results combining', function() {
    test('if confident, it returns single match', async function(assert) {
      this.detectStub.returns(resolve([
        { confidentMatch: A },
        { probableMatches: [B] },
        { probableMatches: [B, C] }
      ]));

      let result = await this.service.detect(0, 0);

      assert.deepEqual(result, 'A');
    });

    test('if multiple confident faces found, it returns multiple matches', async function(assert) {
      this.detectStub.returns(resolve([
        { confidentMatch: A },
        { confidentMatch: B },
        { confidentMatch: B },
        { probableMatches: [B, C] }
      ]));

      let results = await this.service.detect(0, 0);

      assert.deepEqual(results, ['A', 'B', 'C']);
    });

    test('if no confident faces found, it returns probable matches', async function(assert) {
      this.detectStub.returns(resolve([
        { probableMatches: [B] },
        { probableMatches: [B, C] }
      ]));

      let results = await this.service.detect(0, 0);

      assert.deepEqual(results, ['B', 'C']);
    });

    test('if no confident or probable faces found, it returns null', async function(assert) {
      this.detectStub.returns(resolve([
        { probableMatches: [] },
        { probableMatches: [] }
      ]));

      let results = await this.service.detect(0, 0);

      assert.equal(results, null);
    });
  });

  module('sorting & filtering', function() {
    test('it filters out small faces', async function(assert) {
      this.detectStub.returns(resolve([
        { size: 100, confidentMatch: A },
        { size: 80,  confidentMatch: B },
        { size: 50,  confidentMatch: C }
      ]));

      let results = await this.service.detect(0, 0);

      assert.deepEqual(results, [ 'A', 'B' ]);
    });

    test('it sorts faces by distance', async function(assert) {
      this.detectStub.returns(resolve([
        {
          probableMatches: [
            { person: 'A', distance: 0.7 },
            { person: 'B', distance: 0.6 }
          ]
        },
        {
          probableMatches: [
            { person: 'A', distance: 0.1 },
            { person: 'B', distance: 0.5 }
          ]
        }
      ]));

      let results = await this.service.detect(0, 0);

      assert.deepEqual(results, [ 'B', 'A' ]);
    });

    test('it sorts faces by size', async function(assert) {
      this.detectStub.returns(resolve([
        {
          size: 100,
          probableMatches: [
            { person: 'A', distance: 0.7 },
            { person: 'B', distance: 0.6 }
          ]
        },
        {
          size: 80,
          probableMatches: [
            { person: 'A', distance: 0.1 },
            { person: 'B', distance: 0.5 }
          ]
        }
      ]));

      let results = await this.service.detect(0, 0);

      assert.deepEqual(results, [ 'A', 'B' ]);
    });
  });
});
