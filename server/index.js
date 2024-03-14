console.log('app working');

//connect index.js to db.js
const {client, createTables, createUser, fetchUsers, createProduct, fetchProducts, createFavorite, fetchFavorites, destroyFavorite} = require('./db');
//bring in express
const express = require('express');
const app = express();
//json parser middleware
app.use(express.json());

//establish CRUD functionality
//GET users
app.get('/api/users', async(req, res, next)=> {
  try {
    res.send(await fetchUsers());
  }
  catch(error) {
    next(error);
  }
});

//GET products
app.get('/api/products', async(req, res, next)=> {
  try {
    res.send(await fetchProducts());
  }
  catch(error) {
    next(error);
  }
});

//GET favorites
app.get('/api/users/:id/favorites', async(req, res, next)=> {
  try {
    res.send(await fetchFavorites(req.params.id));
  }
  catch(error) {
    next(error);
  }
});

//POST a customer's favorite product
app.post('/api/users/:id/favorites', async(req, res, next)=> {
  try {
    const favorite = await createFavorite({ user_id: req.params.userId, product_id: req.body.product_id});
    res.status(201).send(favorite);
  }
  catch(error){
    next(error);
  }
});

//DELETE favorite
app.delete('/api/users/:userId/favorites/:id', async(req, res, next)=> {
  try {
    await destroyFavorite({ user_id: req.params.userId, id: req.params.id});
    res.sendStatus(204);
  }
  catch(error){
    next(error);
  }
});

//create init function
const init = async()=> {
  console.log('connecting to our database');
  await client.connect();
  console.log('connected to our database');
  await createTables();
  console.log('tables created');
  //seed user and product information
  const [duff, saxophone, skateboard, homer, bart, lisa] = await Promise.all([
    createProduct({name: 'duff'}),
    createProduct({name: 'saxophone'}),
    createProduct({name: 'skateboard'}),
    createUser({ username: 'homer', password: 'doh'}),
    createUser({ username: 'bart', password: 'eatmyshorts'}),
    createUser({ username: 'lisa', password: 'donthaveacow'})
  ]);
  console.log(await fetchUsers());
  console.log(await fetchProducts());

  //create a favorite of bart
  const [bartSkateboards, bartDuffs] = await Promise.all([
    createFavorite({ user_id: bart.id, product_id: skateboard.id}),
    createFavorite({ user_id: bart.id, product_id: duff.id}),
  ]);
  console.log(await fetchFavorites(bart.id));

  await destroyFavorite(bartDuffs);

  //refresh bart's favorites after the destroy function
  console.log(await fetchFavorites(bart.id));

  //add listening port
  const port = process.env.PORT || 3000;
  app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
    console.log(`curl localhost:${port}/api/users`);
    console.log(`curl localhost:${port}/api/products`);
    console.log(`curl localhost:${port}/api/users/${bart.id}/favorites`);
    console.log(`curl -X POST localhost:${port}/api/users/${bart.id}/favorites -d '{"product_id":"${saxophone.id}"} -H "Content-Type:application/json"`);
    console.log(`curl -X DELETE localhost:${port}/api/users/${bart.id}/favorites/${saxophone.id}`);
  });
};

init();
