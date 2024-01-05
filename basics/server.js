const dotenv = require("dotenv")
dotenv.config({ path: "./config.env" });
const express = require("express");

const movieController = require("./Controllers/movieController")
const mongoose = require("mongoose");
const app = express();
app.use(express.json());       // To parse the request body and get the request body     This line is necessary even though method definition is in another file


mongoose.connect(`${process.env.CON_STR}`)
.then((con) => { 
    console.log("Connected to MongoDB")
    // console.log(con.connections)
}).catch(err => console.log("Error connecting to MongoDB", err.message));

/*
const testMovie = new Movie({
    name: "Test Movie",
    description: "It's my favorite movie of all time starring all time great Cillian Murphy",
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
// app.get("/api/v1/movies", movieController.getAllMovies)
// app.get("/api/v1/movies", movieController.getFilteredMovies)       // Comment above line and uncomment this line to see the difference
app.get("/api/v1/movies", movieController.getMovieHandler)            // It takes care of both above lines based on the query string
app.post("/api/v1/movies", movieController.createMovie)            // It takes care of both above lines based on the query string

//      For /api/v1/movies/:id
app.get("/api/v1/movies/:id", movieController.getMovie)
app.patch("/api/v1/movies/:id", movieController.updateMovie)
app.delete("/api/v1/movies/:id", movieController.deleteMovie)

// Check abc.js for more route and aggregation pipeline examples

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

