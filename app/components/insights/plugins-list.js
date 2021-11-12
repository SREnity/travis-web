import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { map, gt } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  flashes: service(),
  api: service(),

  showPluginsModal: false,

  isAllSelected: false,
  allowToggle: gt('selectedPluginIds.length', 0),
  selectedPluginIds: [],
  selectablePluginIds: map('plugins', (plugin) => plugin.id),

  actions: {
    reloadPlugins() {
      this.plugins.reload();
    },

    togglePlugin(pluginId) {
      const { selectedPluginIds } = this;
      const isSelected = selectedPluginIds.includes(pluginId);

      if (isSelected) {
        selectedPluginIds.removeObject(pluginId);
      } else {
        selectedPluginIds.addObject(pluginId);
      }
    },

    toggleAll() {
      const { isAllSelected, selectablePluginIds, selectedPluginIds } = this;

      if (isAllSelected) {
        this.set('isAllSelected', false);
        selectedPluginIds.removeObjects(selectablePluginIds.toArray());
      } else {
        this.set('isAllSelected', true);
        selectedPluginIds.addObjects(selectablePluginIds.toArray());
      }
    },
  },

  toggle: task(function* () {
    let data = {
      ids: this.selectedPluginIds,
    };

    yield this.api.patch('/insights_plugins/toggle_active', { data: data });
  }).drop(),

  deletePlugins: task(function* () {
    let data = {
      ids: this.selectedPluginIds,
    };

    yield this.api.delete('/insights_plugins/delete_many', { data: data });
  }).drop(),
});
