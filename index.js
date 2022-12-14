const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

//middle ware 
app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1.bsfuvd2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try{
        const serviceCollection = client.db('english-platfrom').collection('services')
        const reviewsCollection = client.db('english-platfrom').collection('userRevews')
        //all services
        app.get('/services', async(req, res) =>{
            const query = {}
            const cursor = serviceCollection.find(query)
            const allservices = await cursor.toArray()
            res.send(allservices)
        })
        //for 3 services
        app.get('/fewservices', async(req, res) =>{
            const query ={}
            const cursor = serviceCollection.find(query)
            const fewservice = await cursor.limit(3).toArray()
            res.send(fewservice)
        })
        //services serch for id
        app.get('/services/:id', async(req, res) =>{
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const service = await serviceCollection.findOne(query)
            res.send(service)
        })
        //store user reviews
        app.post('/reviews', async(req, res) =>{
            const service = req.body;
            const result = await reviewsCollection.insertOne(service)
            console.log(result)
            res.send(result)
        })
        //get reviwes 
        app.get('/reviews/:id', async(req, res) =>{
            const id = req.params.id
            const query = {serviceId: id}
            const cursor =  reviewsCollection.find(query)
            const result = await cursor.limit(7).toArray()
            res.send(result)

        })
        //delete user wise review
        app.delete('/reviews/:id', async(req, res) =>{
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const result = await reviewsCollection.deleteOne(query)
            console.log(result)
            res.send(result)
        })
        //update user patch
        app.patch('/reviews/:id', async(req, res) =>{
                const id = req.params.id;
                const status = req.body.status
                const query = {_id: ObjectId(id)}
                const updateDoc = {
                    $set:{
                        status: status
                    }
                }
                const result = await reviewsCollection.updateOne(query, updateDoc)
                res.send(result)
        })

        // query serch for email 
        app.get('/reviews', async(req, res) =>{
            let query = {};
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewsCollection.find(query)
            const result = await cursor.limit(7).toArray()
            res.send(result)
        })

        //post for add services
        app.post('/addservices', async(req, res) =>{
              const addService = req.params.body;
              const result =  await serviceCollection.insertOne(addService)
              res.send(result)
              console.log(result)
        })
    }
    finally{

    }
}

run().catch(err => console.log(err))


app.get('/', (req, res) =>{
    res.send('server is runnig')
})

app.listen(port,()=>{   
     console.log(`server runnig on ${port}`)
})


