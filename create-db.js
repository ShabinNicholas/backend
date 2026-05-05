const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: 'postgres' 
});

async function run() {
  try {
    await client.connect();
    await client.query('CREATE DATABASE staffdb');
    console.log('Database staffdb created successfully');
  } catch (e) {
    if (e.code === '42P04') {
        console.log('Database staffdb already exists');
    } else {
        console.error('Error creating database', e);
    }
  } finally {
    await client.end();
  }
}

run();
