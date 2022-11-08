const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

//middle ware 
app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1.bsfuvd2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try{
        const serviceCollection = client.db('english-platfrom').collection('services')
        app.get('/services', async(req, res) =>{
            const query = {}
            const cursor = serviceCollection.find(query)
            const allservices = await cursor.toArray()
            res.send(allservices)
        })
        app.get('/fewservices', async(req, res) =>{
            const query ={}
            const cursor = serviceCollection.find(query)
            const fewservice = await cursor.limit(3).toArray()
            res.send(fewservice)
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