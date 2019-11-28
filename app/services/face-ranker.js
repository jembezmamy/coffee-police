import Service, { inject as service } from '@ember/service';
import { Promise } from 'rsvp';
import { next } from '@ember/runloop';
import { assign } from '@ember/polyfills';
import { isArray } from '@ember/array';

export default Service.extend({
  faceDetector: service(),

  detect(minTimeout = 0, maxTimeout = 0) {
    let currentTime = Date.now();
    return performDetection(
      this.faceDetector,
      currentTime + minTimeout,
      currentTime + maxTimeout
    );
  }
});

function performDetection(faceDetector, minTime, maxTime, results) {
  return faceDetector.detect().then((faces) => {
    results = results || { confident: [], probable: [] };
    results.confident = results.confident.concat(
      faces.map((face) => wrapMatches(face, [face.confidentMatch])).reduce((a, b) => a.concat(b), [])
    );
    results.probable = results.probable.concat(
      faces.map((face) => wrapMatches(face, face.probableMatches)).reduce((a, b) => a.concat(b), [])
    );
    let rankedResults = rankResults(results);
    if (Date.now() >= maxTime) {
      return rankedResults;
    } else if (Date.now() >= minTime && rankedResults && !isArray(rankedResults)) {
      return rankedResults;
    } else {
      return new Promise(
        (resolve) => next(
          () => resolve(
            performDetection(faceDetector, minTime, maxTime)
          )
        )
      );
    }
  });
}

function wrapMatches(face, matches = []) {
  return matches.compact().map(
    (match) => ({ match, face })
  );
}

function rankResults(results) {
  let { confident, probable, maxSize } = filterBySize(results);

  if (groupByPerson(confident, maxSize).length === 1) {
    return confident[0].match.person;
  } else {
    let merged = groupByPerson(confident.concat(probable), maxSize);
    if (merged.length > 0) {
      return merged.sort(
        (a, b) => b.distance - a.distance
      ).mapBy('person');
    } else {
      return null;
    }
  }
}

function filterBySize(results) {
  let { confident, probable } = results;
  let maxSize = confident.mapBy('face.size').concat(probable.mapBy('face.size')).sort().lastObject;
  let threshold = maxSize * 0.75;
  if (threshold) {
    confident = confident.filter((f) => f.face.size > threshold);
    probable  = probable.filter((f) => f.face.size > threshold);
  }
  return assign({}, results, { confident, probable, maxSize });
}

function groupByPerson(matches, maxSize = 1) {
  let groups = [];
  matches.forEach((match) => {
    let person = match.match.person;
    let group = groups.findBy('person', person);
    if (!group) {
      group = { person, distances: [], sizes: [] };
      groups.push(group);
    }
    group.sizes.push(1 - (match.face.size || 0) / maxSize);
    group.distances.push(match.match.distance);
  });
  return groups.map(
    (group) => ({
      distance: geometricMean(group.distances) * geometricMean(group.sizes),
      person: group.person
    })
  );
}

function geometricMean(values) {
  let product = values.reduce((a, b) => a * b, 1);
  return Math.pow(product, 1 / values.length);
}
