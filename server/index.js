const {
    client, 
    createTables,
    createUser,
    fetchUsers,
    createProduct,
    fetchProducts,
    createFavorite,
    fetchFavorites,
    destroyFavorite
} = require('./db') // export a postgres client from db.js

const express = require('express')
const app = express()

// Routes
app.get('/api/users', async(req, res, next)=>{ // return an array of users
    try {
        res.send(await fetchUsers())
    } catch (error) {
        next(error)
    }
})

// return an array of products
app.get('/api/products', async(req, res, next)=>{
    try {
        res.send(await fetchProducts())
    } catch (error) {
        next(error)
    }
})

// return an array of favorites for the user
app.get('/api/users/:id/favorites', async(req, res, next)=>{
    try {
        res.send(await fetchFavorites(req.params.id))
    } catch (error) {
        next(error)
    }
})

// returns the created favorite with a status code of 201
app.post('/api/users/:id/favorites', async(req, res, next)=>{
    try {
        res.status(201).send(await createFavorite({user_id: req.params.id, product_id: req.body.product_id}))
    } catch (error) {
        next(error)
    }
})

// returns nothing with a status code of 204
app.delete('/api/users/:userId/favorites/:id', async(req, res, next)=>{
    try {
        await destroyFavorite({id: req.params.id, user_id: req.params.userId
        })
    } catch (error) {
        next(error)
    }
})


const init = async() =>{
    // connect postgres client in this init function
    await client.connect()
    console.log("connected to database")
    await createTables();
    console.log("tables created")
    // Create three users and four products
    const [moe, lucy, ethyl, phone, bag, jeans, earbuds] = await Promise.all([
        createUser({username: 'moe', password: 's3cr3t'}),
        createUser({username: 'lucy', password: 's3cr3t!!'}),
        createUser({username: 'ethyl', password: 'shhh'}),
        createProduct({name: 'phone'}),
        createProduct({name: 'bag'}),
        createProduct({name: 'jeans'}),
        createProduct({name: 'earbuds'})
    ]);
    const users = await fetchUsers()
    console.log("Users: ", users)

    const products = await fetchProducts()
    console.log("Products: ", products)

    const favorites = await Promise.all([
        createFavorite({user_id: moe.id, product_id: bag.id}),
        createFavorite({user_id: lucy.id, product_id: bag.id}),
        createFavorite({user_id: moe.id, product_id: jeans.id}),
        createFavorite({user_id: ethyl.id, product_id: phone.id}),
        createFavorite({user_id: ethyl.id, product_id: earbuds.id})
    ])

    console.log("favorites: ", await fetchFavorites(moe.id))
    await destroyFavorite(favorites[0].id)
    console.log("Favorites after deletion: ", await fetchFavorites(moe.id))

    // Testing
    // console.log(`CURL localhost:3000/api/users/${lucy.id}/favorites`)
    // console.log(`CURL -X POST localhost:3000/api/users/${lucy.id}/favorites -d '{"product_id":"${phone.id}"}' -H 'Content-Type:application/json'`);
    console.log(`curl -X DELETE localhost:3000/api/users/${ethyl.id}/favorites/${products[3].id}`);
    console.log('data seeded');
  

    const port = process.env.PORT || 3000
    app.listen(port, ()=> console.log(`listening on port ${port}`))
}

init()