console.log('app working');

//connect index.js to db.js
const {client, createTables, createUser, fetchUsers, createProduct, fetchProducts, createFavorite, fetchFavorites, destroyFavorite} = require('./db');

//create init function
const init = async()=> {
  console.log('connecting to our database');
  await client.connect();
  console.log('connected to our database');
  await createTables();
  console.log('tables created');
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

  console.log(await fetchFavorites(bart.id));
};

init();
