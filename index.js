const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

require('dotenv').config()
const uri = `mongodb+srv://emaJohnUser:emaJohnServer81@cluster0.mzltn.mongodb.net/emaJohnStore?retryWrites=true&w=majority`;

const app = express();
app.use(express.json());
app.use(cors());

// console.log(process.env.DB_USER);

app.get('/',(req,res) => {
    res.send('hello heroku')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("emaJohnStore").collection("products");
    const ordersCollection = client.db("emaJohnStore").collection("orders");

    // add all fakedata from manage inventory
    app.post('/addProduct', (req, res) => {
        const products = req.body;

        productsCollection.insertOne(products)
        .then( result => {
            // console.log(result);
            res.send(result.insertedCount)
        })
    })

    // load all fakedata in UI
    app.get('/products',(req,res) => {
        productsCollection.find({})
        .toArray( (err,documents) => {
            res.send(documents);
        })
    })
    // load single data in UI
    app.get('/product/:key',(req,res) => {
        productsCollection.find({key: req.params.key})
        .toArray( (err,documents) => {
            res.send(documents[0]);
        })
    })

    // productsBykeys review js
    app.post('/productsByKeys', (req,res) => {
        const productKeys = req.body;
        productsCollection.find({key: {$in:productKeys}})
        .toArray( (err,documents) => {
            res.send(documents);
        })
    })

    // add orders from shipment
    app.post('/addOrder', (req, res) => {
        const order = req.body;

        ordersCollection.insertOne(order)
        .then( result => {
            // console.log(result);
            res.send(result.insertedCount > 0)
        })
    })


});


app.listen(process.env.PORT || 4000);