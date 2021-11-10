import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { map, equal, gt } from '@ember/object/computed';

export default Component.extend({
  flashes: service(),

  showProbesModal: false,
  probeType: 'normal',

  allowEdit: equal('selectedProbeIds.length', 1),
  allowToggle: gt('selectedProbeIds.length', 0),
  isAllSelected: false,
  selectedProbeIds: [],
  selectableProbeIds: map('probes', (probe) => probe.id),

  actions: {
    openNormalProbeModal(dropdown) {
      dropdown.actions.close();
      this.set('probeType', 'normal');
      this.set('showProbesModal', true);
    },

    openCustomProbeModal(dropdown) {
      dropdown.actions.close();
      this.set('probeType', 'custom');
      this.set('showProbesModal', true);
    },

    reloadProbes() {
      this.probes.reload();
    },

    toggleProbe(probeId) {
      const { selectedProbeIds } = this;
      const isSelected = selectedProbeIds.includes(probeId);

      if (isSelected) {
        selectedProbeIds.removeObject(probeId);
      } else {
        selectedProbeIds.addObject(probeId);
      }
    },

    toggleAll() {
      const { isAllSelected, selectableProbeIds, selectedProbeIds } = this;

      if (isAllSelected) {
        this.set('isAllSelected', false);
        selectedProbeIds.removeObjects(selectableProbeIds.toArray());
      } else {
        this.set('isAllSelected', true);
        selectedProbeIds.addObjects(selectableProbeIds.toArray());
      }
    }
  }
});
