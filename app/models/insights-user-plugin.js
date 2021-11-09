import Model, { attr } from '@ember-data/model';

export default Model.extend({
  name: attr('string'),
  publicId: attr('string'),
  pluginType: attr('string'),
  pluginCategory: attr('string'),
  lastScanEnd: attr('date'),
  scanStatus: attr('string'),
  pluginStatus: attr('number')
});
