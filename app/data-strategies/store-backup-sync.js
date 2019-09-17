import { SyncStrategy } from '@orbit/coordinator';

export default {
  create() {
    return new SyncStrategy({
      name: 'store-backup-sync',
      source: 'store',
      target: 'backup',
      blocking: true
    });
  }
};
