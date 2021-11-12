const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gchbg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try {
        await client.connect();

        const database = client.db('tour_Maker');
        const serviceCollection = database.collection('services');
        const orderCollection = database.collection('orders');

        //POST API
        app.post('/addServices', async(req, res)=>{
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.json(result);
        })

        //GET API
        app.get('/allServices', async(req, res)=>{
            const result = await serviceCollection.find({}).toArray();
            res.send(result);
        })

        //GET SINGLE SERVICE API
        app.get('/singleService/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await serviceCollection.findOne(query);
            res.send(result);
        })

        //Order Posting API
        app.post('/placeOrder', async(req, res)=>{
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
        })

        //Single Order Getting API
        app.get('/myOrders/:email', async(req, res)=>{
            // const email = req.params.email;
            // const query = { email: email};
            const result = await orderCollection.find({ email: req.params.email}).toArray();
            res.send(result);
        })
        //Order Deleting API 
        app.delete('/deleteOrder/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
           res.json(result);
        })

        //All Order getting API
        app.get('/allOrders', async(req, res)=>{
            const result = await orderCollection.find({}).toArray();
            res.send(result);
        })

        //Update Status
        app.put('/updateStatus/:id', async(req, res)=>{
            const id = req.params.id;
            const updatedStatus = req.body.status;
            const filter = {_id: ObjectId(id)};
            const options = { upsert : true };
            const updatedDoc = {
                $set: {
                    status: updatedStatus
                }
            };
            const result = await orderCollection.updateOne(filter, updatedDoc, options);
            res.json(result);
            
        })


    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send("All good. Go Ahead...");
})

app.listen(port, ()=>{
    console.log("app is listening to port", port);
})