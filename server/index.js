//CREATE DATABASE acme_store_db;
console.log('app working');

//connect index.js to db.js
const {client, createTables} = require('./db.js');

//create init function
const init = async()=> {
  console.log('connecting to our database');
  await client.connect();
  console.log('connected to our database');
  console.log('tables created');
};

init();
