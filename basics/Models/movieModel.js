const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({        // In this schema, we can define the properties we want to have for our model
    name: {
        type: String,
        required: [true, "Name is required field"], // 2nd arg is validation error message
        unique: true,       // So that we don't have 2 movies with same name
        trim: true,         // Removes all the white spaces from beginning and end of string (movie name)
    },
    description: {
        type: String,
        required: [true, "Description is required field"], // 2nd arg is validation error message
        trim: true,         // Removes all the white spaces from beginning and end of string (movie name)
    },
    duration: {
        type: Number,       
        required: [true, "Duration is required field"],    // 2nd arg is validation error message
    },
    rating: {
        type: Number,
        default: 1.0,       // If no value is specified, then this default value will be used
    },
    totalRating: {
        type: Number,
    },
    releaseYear: {
        type: Number,
        required: [true, "Release year is required field"],    // 2nd arg is validation error message
    },
    releaseDate: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now().toString({
            minute: "2-digit",
            hour: "2-digit",
            day: "short",
            month: "short",
            year: "numeric",
        })
    },
    genres: {
        type: [String],     // Array of strings
        required: [true, "Genre is required field"],    // 2nd arg is validation error message
    },
    directors: {
        type: [String],     // Array of strings
        required: [true, "Director is required field"],    // 2nd arg is validation error message
    },
    coverImage: {
        type: String,
        required: [true, "Cover image is required field"],    // 2nd arg is validation error message
    },
    actors: {
        type: [String],     // Array of strings
        required: [true, "Actors is required field"],    // 2nd arg is validation error message
    },
    price: {
        type: Number,
        required: [true, "Price is required field"],    // 2nd arg is validation error message
    },
})

const Movie = mongoose.model("movie", movieSchema); // 1st arg is name of model, and 2nd arg is schema we want to use for this model
// Using above model we can perform CRUD operations on our database
// In database a collection will be created with name movies (plural of model name)
// Convention is to start the model name with capital letter

module.exports = Movie;