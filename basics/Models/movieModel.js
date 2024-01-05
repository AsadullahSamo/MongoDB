const fs = require("fs");      
const validator = require("validator"); // This is a library that can be used to validate strings, numbers, etc.
const mongoose = require("mongoose");


const movieSchema = new mongoose.Schema({        // In this schema, we can define the properties we want to have for our model
    name: {
        type: String,
        required: [true, "Name is required field"], // 2nd arg is validation error message
        unique: true,       // So that we don't have 2 movies with same name
        trim: true,         // Removes all the white spaces from beginning and end of string (movie name)
        minLength: [5, "Movie name must be at least 5 characters long"], // 2nd arg is validation error message
        maxLength: [50, "Movie name must be at most 50 characters long"], // 2nd arg is validation error message
        validate: [validator.isAlpha, "Name should not contain any special characters"],    // This will check if the movie name contains only alphabets
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
        min: [1, "Rating must be at least 1"], // 2nd arg is validation error message
        max: [5, "Rating must be at most 5"], // 2nd arg is validation error message

        // This is a custom validator
        // validate: {         
        //     validator: function(val) {
        //         return val >= 1 && val <= 10;     // This will return true if the rating is a multiple of 0.5
        //     },
        //     message: "Rating must be greater than or equal to 1 and less than or equal to 10"
        // }
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
        default: Date.now(),
        select: false      // This will not be shown in the response. This is useful for fields like password
    },
    genres: {
        type: [String],     // Array of strings
        required: [true, "Genre is required field"],    // 2nd arg is validation error message
        enum: {
            values: ["Action", "Comedy", "Drama", "Thriller", "Horror"],
            message: "Genre must be one of the following: action, comedy, drama, thriller, horror"
        }
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
    createdBy: String,
}, {
    toJSON: { virtuals: true },     // This will make sure that virtual properties are shown in the response
    toObject: { virtuals: true },   // This will make sure that virtual properties are shown in the response
})

//                  DOCUMENT MIDDLEWARE
// All the middleware functions should be defined before the model is created
// This middleware will run before the document is saved to the database

// Register the middlewares with the movieSchema
movieSchema.pre('save', function(next) {
    this.createdBy = `ASAD`;
    next();
});

movieSchema.post("save", function(doc, next) {
    const content = `New movie document ${doc.name} was created and saved to the database by ${doc.createdBy}\n`;
    fs.writeFile("./Log/log.txt", content, { flag: "a" }, (err) => {
        if(err) {
            console.error(err); // Log the error
        } else {
            console.log("Log file updated");
        }
        next(); // Always call next, whether there's an error or not
    }); 
});

//                  QUERY MIDDLEWARE
movieSchema.pre(/^find/, function(next) {    // This will run for all the queries that start with find
    this.find({ releaseYear: { $gte: 2014 } });   // This will only return the movies that were released after 2000
    this.start = Date.now();    // This will give us the time when the query was executed
    next();
})

movieSchema.post(/^find/, function(docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds`);
    next();
})

const Movie = mongoose.model("movie", movieSchema); // 1st arg is name of model, and 2nd arg is schema we want to use for this model
// Using above model we can perform CRUD operations on our database
// In database a collection will be created with name movies (plural of model name)
// Convention is to start the model name with capital letter


//       VIRTUAL PROPERTIES
// Virtual properties are the properties that are not stored in the database but are calculated using other properties
// We can't use virtual properties in CRUD operations, but we can use them in our code
movieSchema.virtual("durationInHours").get(function() {
    return this.duration / 60;
})




module.exports = Movie;