const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'destinopia',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

