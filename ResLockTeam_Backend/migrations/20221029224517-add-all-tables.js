'use strict';
var async = require('async');
var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  async.series([
    db.createTable.bind(db, 'user', {
      email: {type: "string", primaryKey: true},
      first_name: {type: "string"},
      last_name: {type: "string"},
      password: {type: "string"},
      room: {type: "int"},
      privilege: {type: "int"},
      org_id: {type: "int"},
      building_id: {type: "int"},
      verified: {type: "boolean"}
    }), 
    db.createTable.bind(db, 'organization', {
      org_id: {type: "int", primaryKey: true, autoIncrement: true},
      name: {type: "string"}
    }),
    db.createTable.bind(db, 'mail', {
      mail_id: {type: "int", primaryKey: true, autoIncrement: true},
      date_received: {type: "datetime"},
      date_picked_up: {type: "datetime"},
      is_letter: {type: "boolean"},
      email: {type: "string"},
      building_id: {type: "int"},
    }),
    db.createTable.bind(db, 'building', {
      building_id: {type: "int", primaryKey: true, autoIncrement: true},
      org_id: {type: "int"},
      name: {type: "string"},
      addr: {type: "string"}
    }),
    db.createTable.bind(db, 'otp', {
      user_email: {type: "string", primaryKey: true},
      otp: {type: "string"},
      created_at: {type: "datetime"},
      expires_at: {type: "datetime"}
    })
  ], callback)
};

exports.down = function(db, callback) {
  async.series([
    db.dropTable.bind(db, 'user'),
    db.dropTable.bind(db, 'organization'),
    db.dropTable.bind(db, 'building'),
    db.dropTable.bind(db, 'mail'),
    db.dropTable.bind(db, 'otp')
  ], callback);
};

exports._meta = {
  "version": 1
};
