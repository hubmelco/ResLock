'use strict';

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

exports.up = function (db) {
  return db.createTable('notification',
    {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      to_email: {
        type: 'string',
        foreignKey: {
          name: 'notification_user_id_to_fk',
          table: 'user',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
          },
          mapping: 'email'
        }
      },
      from_email: {
        type: 'string',
        foreignKey: {
          name: 'notification_user_id_from_fk',
          table: 'user',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
          },
          mapping: 'email'
        }
      },
      type: { type: "string" },
      content: { type: "json" },
      status: { type: "int", defaultValue: 2, notNull: true, comment: "0: denied, 1: approved,  2: pending" },
      created_at: { type: 'timestamp', notNull: true, defaultValue: new String('CURRENT_TIMESTAMP') },
      updated_at: { type: 'timestamp', notNull: false, defaultValue: null},
    });
};

exports.down = function (db) {
  return db.dropTable('notification');
};

exports._meta = {
  "version": 1
};
