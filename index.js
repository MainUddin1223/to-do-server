const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.5ajro.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const todoCollection = client.db('todo_app').collection('todoList');
        app.post('/todoList', async (req, res) => {
            const newTodo = req.body;
            const result = await todoCollection.insertOne(newTodo)
            res.send(result)
        })

        app.get('/todoList', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = await todoCollection.find(query)
            const result = await cursor.toArray();
            res.send(result)
        })
        app.delete('/todoList/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await todoCollection.deleteOne(query);
            if (result.deletedCount === 1) {
                res.send(result)
            }

        })
    }


    finally {

    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('hello world')
})


app.listen(port, () => {
    console.log('listening')
})