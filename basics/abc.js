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


app.get("/api/v1/movies", movieController.getAllMovies)
app.get("/api/v1/movies/genre", movieController.genreList)
app.get("/api/v1/movies/stats", movieController.getMovieStats)

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
