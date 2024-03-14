# GOALS

- POSTGRES
- client - a node pg client
- createTables method - drops and creates the tables for your application
- createProduct - creates a product in the database and returns the created record
- createUser - creates a user in the database and returns the created record. The password of the user should be hashed using bcrypt.
- fetchUsers - returns an array of users in the database
- fetchProducts - returns an array of products in the database
- createFavorite - creates a favorite in the database and returns the created record
- fetchFavorites - returns an array favorites for a user
- destroyFavorite - deletes a favorite in the database

- EXPRESS
- GET /api/users - returns array of users
- GET /api/products - returns an array of products
- GET /api/users/:id/favorites - returns an array of favorites for a user
- POST /api/users/:id/favorites - payload: a product_id
returns the created favorite with a status code of 201
- DELETE /api/users/:userId/favorites/:id - deletes a favorite for a user, returns nothing with a status code of 204