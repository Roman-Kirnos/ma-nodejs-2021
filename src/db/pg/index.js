const { Pool } = require('pg');

const {
  db: {
    names: { PG },
  },
} = require('../../config');
const { throwIfInvalid } = require('../../utils');

const dbProducts = require('./products');
const dbTypes = require('./types');
const dbColors = require('./colors');

let database;
let client;

async function createDBIfNotExists() {
  await client.query(`SELECT 'CREATE DATABASE ${database}'
      WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${database}')`);

  return true;
}

async function testConnection() {
  console.log(`Hello from ${PG} testConnection`);

  await client.query('SELECT NOW()');
}

async function close() {
  console.log(`INFO: Closing ${PG} DB wrapper`);

  client.end();
}

module.exports = config => {
  throwIfInvalid(config, 500, 'No config!');

  throwIfInvalid(config.database, 500, 'Undefined database');
  database = config.database;

  client = new Pool(config);

  const products = dbProducts(client);
  const types = dbTypes(client);
  const colors = dbColors(client);

  return {
    createDBIfNotExists,
    testConnection,
    close,

    // --------------

    products,
    types,
    colors,
  };
};
