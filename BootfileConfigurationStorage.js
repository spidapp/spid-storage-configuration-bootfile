'use strict';

var util = require('util');
var ConfigurationStorageInterface = require('spid-storage-configuration-interface');
var JsonFileConfigurationStorage = require('spid-storage-configuration-jsonfile');
var _ = require('lodash');
var ensure = require('file-ensure');

function BootfileConfigurationStorage(defaultConfigurationBootfile) {
  if (!defaultConfigurationBootfile) {
    // @todo use SpidException instead
    throw new Error(BootfileConfigurationStorage.name + '(defaultConfigurationBootfile), `defaultConfigurationBootfile` is required');
  }

  /**
   * Default bootfile configuration filename
   * @type {String}
   */
  JsonFileConfigurationStorage.call(this, defaultConfigurationBootfile || DEFAULT_CONFIGURATION_BOOTFILE);
}

util.inherits(BootfileConfigurationStorage, JsonFileConfigurationStorage);

/**
 * @override JsonFileConfigurationStorage::init
 * @param  {Configuration} configuration
 * @param  {Function} f(err)
 */
BootfileConfigurationStorage.prototype.init = function (configuration, f) {
  // bootfile location is not configurable via Spid Configuration, it MUST BE set at instanciation time.
  // if you need to change this, use the env. variable SPID_BOOTFILE
  this._ensureConfigFileExists();
  f();
};

// Helpers
BootfileConfigurationStorage.prototype._ensureConfigFileExists = function () {
  // Ensure that the file exist, create it otherwise
  ensure(this._jsonfilename);
};

module.exports = ConfigurationStorageInterface.ensureImplements(BootfileConfigurationStorage);
