'use strict';
var async = require('async');
var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, callback) {
  async.series([
    db.changeColumn.bind(db, 'user', "privilege", {
      type: "int",
      defaultValue: 3
    }),
    db.changeColumn.bind(db, 'user', "verified", {
      type: "boolean",
      defaultValue: false
    }),
    db.addForeignKey.bind(db, 'user', 'organization', 'user_org_id_foreign', {
      'org_id': 'org_id'
    }, {
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT'
    }),
    db.addForeignKey.bind(db, 'user', 'building', 'user_building_id_foreign', {
      'building_id': 'building_id'
    }, {
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT'
    }),
    db.addForeignKey.bind(db, 'mail', 'building', 'mail_building_id_foreign', {
      'building_id': 'building_id'
    }, {
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT'
    }),
    db.addForeignKey.bind(db, 'mail', 'user', 'mail_email_foreign', {
      'email': 'email'
    }, {
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT'
    }),

    db.addForeignKey.bind(db, 'building', 'organization', 'building_org_id_foreign', {
      'org_id': 'org_id'
    }, {
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT'
    }),
    db.addForeignKey.bind(db, 'otp', 'user', 'otp_user_email_foreign', {
      'user_email': 'email'
    }, {
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT'
    })
  ], callback)
};

exports.down = function (db, callback) {
  async.series([
    db.changeColumn.bind(db, 'user', 'privilege', {
      type: 'boolean',
      defaultValue: null
    }),
    db.changeColumn.bind(db, 'user', 'verified', {
      type: 'int',
      defaultValue: null
    }),
    db.removeForeignKey.bind(db, 'user', 'user_org_id_foreign'),
    db.removeForeignKey.bind(db, 'user', 'user_building_id_foreign'),
    db.removeForeignKey.bind(db, 'mail', 'mail_building_id_foreign'),
    db.removeForeignKey.bind(db, 'mail', 'mail_email_foreign'),
    db.removeForeignKey.bind(db, 'building', 'building_org_id_foreign'),
    db.removeForeignKey.bind(db, 'otp', 'otp_user_email_foreign')
  ], callback)
};

exports._meta = {
  "version": 1
};
