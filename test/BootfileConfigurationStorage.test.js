'use strict';

var fs                           = require('fs');
var BootfileConfigurationStorage = require('../');
var Configuration                = require('./stub/Configuration');
var p                            = require('path');
var t                            = require('chai').assert;
var _                            = require('lodash');

var KEY                          = 'storage';
var VALUE                        = 'spid-storage-configuration-jsonfile';
var JSON_FILE                    = p.resolve(__dirname, './fixtures/spid.conf.json');
var JSON_FILE2                   = p.resolve(__dirname, './fixtures/spid2.conf.json');


describe('BootfileConfigurationStorage', function () {
  var storage, configuration;

  beforeEach(function (done) {
    try{
      fs.unlinkSync(JSON_FILE);
      fs.unlinkSync(JSON_FILE2);
    }catch(err){}

    storage                      = new BootfileConfigurationStorage(JSON_FILE);
    configuration                = Configuration.get();
    done();
  });

  it('default configuration should be available', function (f) {
    storage.init(configuration, function(err){
      if(err){throw err;}
    });

    f();
  });

  it('should initialize', function (f) {
    storage.init(configuration, function(err){
      t.equal(err, void 0);
      storage.dispose(f);
    });
  });

  describe('once initialized', function () {
    beforeEach(function (f) {
      // init config
      storage.init(configuration, function (err){
        if(err){throw err;}
        f();
      });
    });

    describe('.write', function () {
      it('should be able to write to storage', function (f) {
        storage.write(KEY, VALUE, function(err, value){
          t.strictEqual(err, null);
          f();
        });
      });
    });

    describe('.read', function () {
      it('should be able to read non-existent key', function (f) {
        storage.remove(KEY, function(err, value){
          t.strictEqual(err, null);
          storage.read(KEY, function(err, value){
            t.strictEqual(err, null);
            t.strictEqual(value, null);
            f();
          });
        });
      });

      it('should be able to read key', function (f) {
        storage.write(KEY, VALUE, function(err, value){
          storage.read(KEY, function(err, value){
            t.strictEqual(value, VALUE);
            f();
          });
        });
      });
    });

    describe('.remove', function () {
      it('should be able to remove a non-existent key', function (f) {
        storage.remove(KEY, function(err){
          t.strictEqual(err, null);
          f();
        });
      });

      it('should be able to remove a key', function (f) {
        storage.watch([KEY], function(key, newValue){
          t.strictEqual(key, KEY);
          t.strictEqual(newValue, VALUE);
          f();
        });

        storage.write(KEY, VALUE, function(err, value){
          storage.remove(KEY, function(err){
            t.strictEqual(err, null);
          });
        });
      });
    });

    describe('.watch', function () {
      it('should be able to watch for a key change', function (f) {
        storage.watch(['a', 'b', 'c'], function(key, newValue){
          t.strictEqual(key, 'b');
          t.strictEqual(newValue, 'hello world');
          f();
        });

        storage.write('b', 'hello world', function(err){
          //
        });
      });
    });

    // we don't test here the configuration change because the BootfileConfiguration CAN'T change
    // without instanciation another `BootfileConfigurationStorage`

    afterEach(function (f) {
      storage.dispose(f);
    });
  });
});
