import Model, { attr } from '@ember-data/model';

export default Model.extend({
  name: attr('string'),
  publicId: attr('string'),
  privateKey: attr('string'),
  pluginType: attr('string'),
  accountName: attr('string'),
  appKey: attr('string'),
  domain: attr('string'),
  subPlugin: attr('string'),
  pluginCategory: attr('string'),
  lastScanEnd: attr('date'),
  scanStatus: attr('string'),
  pluginStatus: attr('string')
});
