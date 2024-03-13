//require postgres
const pg = require('pg');
//require uuid
const uuid = require('uuid');
const bcrypt = require('bcrypt');
//CREATE DATABASE acme_store_db;
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_store_gh_db');

const createTables = async()=> {
  const SQL = `
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;
    CREATE TABLE users(
      id UUID PRIMARY KEY,
      username VARCHAR(20) UNIQUE NOT NULL,
      password VARCHAR(225) NOT NULL
    );
    CREATE TABLE products(
      id UUID PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL
    );
    CREATE TABLE favorites(
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) NOT NULL,
      product_id UUID REFERENCES products(id) NOT NULL,
      CONSTRAINT user_favorite_unique UNIQUE (user_id, product_id)
    );
  `;
  await client.query(SQL);
};

// createUser
const createUser = async({username, password})=> {
  const SQL = `
    INSERT INTO users(id, username, password)
    VALUES($1, $2, $3)
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), username, await bcrypt.hash(password, 5)]);
  return response.rows[0];
};

const fetchUsers = async()=> {
  const SQL = `
    SELECT *
    FROM users
  `;
  const response = await client.query(SQL);
  return response.rows;
};

createProduct = async({name})=> {
  const SQL = `
    INSERT INTO products(id, name)
    VALUES ($1, $2)
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name])
  return response.rows[0];
};

const fetchProducts = async()=> {
  const SQL = `
    SELECT *
    FROM products
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const createFavorite = async({user_id, product_id}) => {
  console.log(user_id);
  const SQL = `
    INSERT INTO favorites(id, user_id, product_id)
    VALUES($1, $2, $3)
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), user_id, product_id])
  return response.rows[0];
};

const fetchFavorites = async(user_id)=> {
  const SQL = `
    SELECT *
    FROM favorites
    WHERE user_id = $1
  `;
  const response = await client.query(SQL, [user_id]);
  return response.rows;
};

const destroyFavorite = async({user_id, id})=> {
  const SQL = `
    DELETE FROM favorites
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `;
  const response = await client.query(SQL, [id, user_id]);
  if(!response.rows.length){
    const error = Error('no favorite found');
    error.status = 500;
    throw error;
  }
}

//we must export anything created in db.js that we want to pass into index.js and utilize in that file
module.exports = {
  client,
  createTables,
  createProduct,
  createUser,
  fetchUsers,
  fetchProducts,
  createFavorite,
  fetchFavorites,
  destroyFavorite
};