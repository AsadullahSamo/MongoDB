const express = require("express");
const dotenv = require("dotenv")
dotenv.config({ path: "./config.env" });

const movieController = require("./Controllers/movieController")
const mongoose = require("mongoose");
const app = express();

app.use(express.json());       // To parse the request body and get the request body     This line is necessary even though method definition is in another file

mongoose.connect(process.env.CON_STR)
.then((con) => { 
    console.log("Connected to MongoDB")
    // console.log(con.connections)
}).catch(err => console.log("Error connecting to MongoDB", err.message));

/*
const testMovie = new Movie({
    name: "Beauty and the Beast",
    description: "It's my favorite movie of all time starring all time great Emma Watson",
    duration: 120,
    rating: 9.9,
})

// Using above we created a document in our database

testMovie.save()       // This will save the document in database
.then((doc) => console.log(doc))
.catch((err) => console.log(`Error occured: ${err.message}`))
*/


// ALL THE ROUTES
//      For /api/v1/movies
app.post("/api/v1/movies", movieController.createMovie)
app.get("/api/v1/movies", movieController.getAllMovies)


//      For /api/v1/movies/:id
app.get("/api/v1/movies/:id", movieController.getMovie)
app.patch("/api/v1/movies/:id", movieController.updateMovie)
app.delete("/api/v1/movies/:id", movieController.deleteMovie)



const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

