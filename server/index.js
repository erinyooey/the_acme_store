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
}

init()