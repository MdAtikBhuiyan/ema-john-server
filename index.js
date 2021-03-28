// const express = require('express');
// const cors = require('cors');
// const MongoClient = require('mongodb').MongoClient;

// require('dotenv').config()
// const uri = `mongodb+srv://emaJohnUser:emaJohnServer81@cluster0.mzltn.mongodb.net/emaJohnStore?retryWrites=true&w=majority`;

// const app = express();
// app.use(express.json());
// app.use(cors());

// // console.log(process.env.DB_USER);

// app.get('/',(req,res) => {
//     res.send('hello heroku')
// })


// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//     const productsCollection = client.db("emaJohnStore").collection("products");
//     const ordersCollection = client.db("emaJohnStore").collection("orders");

//     // add all fakedata from manage inventory
//     app.post('/addProduct', (req, res) => {
//         const products = req.body;

//         productsCollection.insertOne(products)
//         .then( result => {
//             // console.log(result);
//             res.send(result.insertedCount)
//         })
//     })

//     // load all fakedata in UI
//     app.get('/products',(req,res) => {
//         productsCollection.find({})
//         .toArray( (err,documents) => {
//             res.send(documents);
//         })
//     })
//     // load single data in UI
//     // app.get('/product/:key',(req,res) => {
//     //     productsCollection.find({key: req.params.key})
//     //     .toArray( (err,documents) => {
//     //         res.send(documents[0]);
//     //     })
//     // })

//     // productsBykeys review js
//     app.post('/productsByKeys', (req,res) => {
//         const productKeys = req.body;
//         productsCollection.find({key: {$in:productKeys}})
//         .toArray( (err,documents) => {
//             res.send(documents);
//         })
//     })

//     // add orders from shipment
//     app.post('/addOrder', (req, res) => {
//         const order = req.body;

//         ordersCollection.insertOne(order)
//         .then( result => {
//             // console.log(result);
//             res.send(result.insertedCount > 0)
//         })
//     })


// });


// app.listen(process.env.PORT || 4000);


const express = require('express')
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mzltn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(express.json());
app.use(cors());

const port = 5000;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const productsCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION}`);
    const ordersCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_ORDER}`);

    app.post('/addProduct', (req, res) => {
        const products = req.body;
        console.log(products);
        productsCollection.insertOne(products)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount);
        })
    })

    app.get('/', (req, res) => {
        res.send('hello from ema-john-server side')
    })

    app.get('/test',(req,res) => {
        res.json({
            message:true
        })
    })

    // app.get('/products', (req, res) => {
    //     productsCollection.find({})
    //     .toArray((err, documents) =>{
    //         res.send(documents);
    //     })
    // })

    app.get('/product/:key', (req, res) => {
        productsCollection.find({key: req.params.key})
        .toArray((err, documents) =>{
            res.send(documents[0]);
        })
    })

    app.post('/productByKeys', (req, res) => {
        const productKeys = req.body;
        productsCollection.find({key: {$in: productKeys}})
        .toArray((err, documents) =>{
            res.send(documents);
        })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })

    console.log('database connected!')

});

app.listen(process.env.PORT || port);
