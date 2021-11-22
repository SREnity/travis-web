import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed, observer } from '@ember/object';

export default Component.extend({
  api: service(),

  scanLogs: [],
  scanLogsPresentable: computed('scanLogs.[]', function () {
    return this.scanLogs.map((el) => (
      {
        key: Object.keys(el)[0],
        value: Object.values(el)[0]
      }
    ));
  }),
  scanInProgress: false,
  collapseValues: [],

  modalOpenObserver: observer('isOpen', function () {
    if (this.isOpen) {
      this.plugin.getScanLogs.perform().then((data) => {
        let node = this.scanLogs.popObject();
        data.scan_logs.forEach((scanLog) => {
          let logType = scanLog.log_type;
          if (!node || !node[logType]) {
            if (node) {
              this.scanLogs.pushObject(node);
            }
            node = {};
            node[logType] = [];
          }
          let item = {};
          for (const [key, value] of Object.entries(scanLog)) {
            if (value) {
              if (scanLog.text.includes('Scan started')) {
                item['text'] = scanLog.text;
                item['additional_text'] = scanLog.created_at;
              } else {
                item[key] = value;
              }
            }
          }
          if (logType == 'probes') {
            let index = node[logType].findIndex(scanLogT => scanLogT.test_template_id == scanLog.test_template_id);
            node[logType].splice(++index, 0, item);
          } else {
            node[logType].pushObject(item);
          }
        });
        this.scanLogs.pushObject(node);
        this.set('scanInProgress', data.meta.scan_status_in_progress);
      });
    }
  }),

  actions: {
    collapseSection(evt) {
      if (evt) {
        let btn = document.getElementById(evt.target.id);
        let section = evt.target.parentElement.nextElementSibling;
        if (btn.classList.contains('collapsed')) {
          btn.classList.remove('collapsed');
          section.classList.remove('collapsedSection');
        } else {
          btn.classList.add('collapsed');
          section.classList.add('collapsedSection');
        }
      }
    }
  }
});
