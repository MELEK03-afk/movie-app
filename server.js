import express from 'express'
import { MongoClient , ObjectId } from 'mongodb'
const port = process.env.PORT

const app = express()

// Body Parser Middleware
app.use(express.json())


// Connect To DataBase (MongoDB) Using MongoClient

const url = process.env.MONGO_URL
const client = new MongoClient(url)
let dbName='moviesDB'
let db
const connectToDB = async () => {
        try {
            await client.connect()
            db = client.db(dbName)
            console.log('Connected To DATABASE')
        } catch (error) {
            console.log(`Error when try to connect ${error}`)
        }
    
}

connectToDB()

// Add Movie

app.post('/movies/add-movie' , async (req , res) => {
    try {
        const movie = req.body
        const result = await db.collection('movies').insertOne(movie)
        if(!result){
            res.status(500).json({message : 'Cannot add the movie'})
        }
        res.status(201).json({message : 'Movie Created !!'})
    } catch (error) {
        console.log(error)
        res.status(500).send('Cannot add a movie')
    }
})

// Get All Movies

app.get('/movies' , async (req,res) => {
    try {
        const result = await db.collection('movies').find().toArray()
        if(!result){
            return res.status(500).json({message : 'No Movies Found'})
        }
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        res.status(500).send('Cannot get all movies')
    }
})


// Get a Single Movie By Title and Id

app.get('/oneMovie/:title',async(req,res)=>{
    try {
        const { title } = req.params
        // const result = await db.collection('movies').findOne({ _id: new ObjectId(id) })
         const result = await db.collection('movies').findOne({ title })
        if(!result){
            return res.status(500).json({message : 'Movie not  Found'})
        }
        res.status(200).json(result)

    } catch (error) {
        console.log(error)
    }
})

// Update One Movie

app.put('/UpdateMovie/:id',async(req,res)=>{
    try {
        const { id } = req.params
        const Newmovie=req.body
        const result = await db.collection('movies').updateOne(
            { _id: new ObjectId(id) },
            {$set:Newmovie}
        )
        if(result.matchedCount === 0){
            return res.status(500).json({message : 'Movie not  Found'})
        }
      
        res.status(200).json(result)


    } catch (error) {
        console.log(error)
         res.status(500).json({message : 'The Movie not  Found'})

    }
})
// Delete Movie

app.delete('/deleteMovie/:title',async(req,res)=>{
    try {
        const { title } = req.params
         const result = await db.collection('movies').deleteOne({ title})
        if(result.deleteCount === 0){
            return res.status(500).json({message : 'Movie not  Found'})
        }
        res.status(200).json(result)

    } catch (error) {
        console.log(error)
    }
})


app.listen(port , () => {
    console.log(`Server is running on port ${port}`)
})