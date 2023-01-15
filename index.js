const express = require( 'express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const dotenv = require('dotenv').config();
const port=process.env.PORT||5000;
const app=express()

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uuzniqz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        const userCollection = client.db('srilankaTourist').collection('userData')
        const DataCollection = client.db('srilankaTourist').collection('dataCollection')
       const MiddleDataCollection=client.db('srilankaTourist').collection('MiddleData')

      app.get('/cartData',async(req,res)=>{
        const query={}
        const cartDataCollection=await DataCollection.find(query).limit(5).toArray()
        res.send(cartDataCollection)
      })
      
      app.get('/middleData',async(req,res)=>{
        const query={}
        const MiddleCollection=await MiddleDataCollection.find(query).toArray()
        res.send( MiddleCollection)
      })

    //Get the booking all data from mongoDB
    app.get('/bookingData',async (req, res) => {
      const email = req.query.email;
      console.log(email)
      const query = { userEmail: email };
      const bookingData = await DataCollection.find(query).toArray()
      res.send(bookingData)
  })

    app.post("/cartData",async(req,res)=>{
        const cartData=req.body;
        const result=await DataCollection.insertOne(cartData);
        res.send(result)
        })

          //users post
    app.post('/users', async (req, res) => {
      const users = req.body;
      const result = await userCollection.insertOne(users)
      res.send(result)
  })

    // admin access
    app.get('/users/admin/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email }
      const user = await userCollection.findOne(query);
      res.send({ isAdmin: user?.role === "admin" });
  })

        app.delete("/cartId/:id",async(req,res)=>{
          const CartId=req.params.id;
          const query={_id:ObjectId(CartId)}
          const result=await DataCollection.deleteOne(query);
          console.log(result,CartId)
          res.send(result)
          })

          app.put("/reportProduct/:id",async (req, res) => {
            const id = req.params.id;
            const report = req.body;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updateProductDoc = {
              $set: {
                report:report.reported 
              },
            };
            const updateProduct = await DataCollection.updateOne(
              filter,
              updateProductDoc,
              option
            );
            res.send(updateProduct);
          });
  

     
 

    }
    finally{

    }
}run().catch(err => console.error(err))




app.get('/',(req,res)=>{
    res.send("sriLanka tourist incoming")
})
app.listen(port,(req,res)=>{
console.log(`sriLanka running the port number ${port}`)
})