import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { observer } from '@ember/object';

export default Component.extend({
  api: service(),

  scanLogs: [],
  scanInProgress: false,

  modalOpenObserver: observer('isOpen', function () {
    if (this.isOpen) {
      this.plugin.getScanLogs.perform().then((data) => {
        let node = this.scanLogs.pop();
        data.scan_logs.forEach((scanLog) => {
          let logType = scanLog.log_type;
          if (!node || !node[logType]) {
            if (node) {
              this.scanLogs.push(node);
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
            node[logType].push(item);
          }
        });
        this.scanLogs.push(node);
        this.set('scanInProgress', data.meta.scan_status_in_progress);
      });
    }
  }),
});
