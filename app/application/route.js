import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  dataCoordinator: service(),

  async beforeModel() {
    const backup = this.dataCoordinator.getSource('backup');
    const transform = await backup.pull(q => q.findRecords());
    await this.store.sync(transform);

    await this.dataCoordinator.activate();
  }
});
