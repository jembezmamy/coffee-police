import SourceClass from '@orbit/indexeddb';

export default {
  create(injections = {}) {
    injections.name = 'backup';
    injections.namespace = 'coffe-police';
    return new SourceClass(injections);
  }
};
