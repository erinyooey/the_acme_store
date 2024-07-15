const {client, createTables, createUser, createProduct} = require('./db') // export a postgres client from db.js

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
    console.log("moe.id: ",moe.id);
    console.log("bag.id: ", bag.id)
}

init()