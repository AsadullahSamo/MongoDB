const Movie = require("./../Models/movieModel");
const express = require("express");
const app = express();

app.use(express.json());       // To parse the request body and get the request body

exports.getAllMovies = async (req, res) => {
  
    // SORTING LOGIC
    let query = Movie.find();
    if(req.query.sort) {
        // movies.sort("createdAt rating")    // Same as db.movies.aggregate([{$sort: {createdAt: 1, rating: 1}}])
        // movies.sort("-price rating")      // Same as db.movies.aggregate([{$sort: {price: -1, rating: -1}}])     
        const sortBy = req.query.sort.split(",").join(" ");  // This will replace all the commas with spaces. Provide request like (http://localhost:8000/api/v1/movies?sort=-price,rating)        
        query = query.sort(sortBy);
    }

    // LIMITING FIELDS LOGIC
    if(req.query.fields) {
        // query.select("name price")  // Same as db.movies.find({}, {name: 1, price: 1})
        
        const fields = req.query.fields.split(",").join(" ");  // This will replace all the commas with spaces. Provide request like (http://localhost:8000/api/v1/movies?fields=name,price)
        query = query.select(fields);
    } else {
        query = query.select("-__v");   // This will exclude __v field from the response
    }

    // PAGINATION
    // query.skip(2).limit(10);    // This will skip first 2 documents and will return next 10 documents. Same as db.movies.aggregate([{$skip: 2}, {$limit: 10}])
    const page = req.query.page * 1 || 1;   // Convert string to number
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if(req.query.page) {
        const numMovies = await Movie.countDocuments();    // Movie.countDocuments() will return the total number of documents in the movies collection
        if(skip >= numMovies) throw new Error("This page does not exist");
    }

    const movies = await query;
    
    
    try{
        res.status(200).json({
            status: "success",
            length: movies.length,
            data: {
                movies,
            }
            
        });
    }
    catch(err) {
        res.status(404).json({
            status: "fail",
            message: err.message
        });
    }
  
}


exports.createMovie = async (req, res) => {
    // req.body will contain the data that we want to insert in database
    console.log(req.body);
    const movie = await Movie.create(req.body);       // Can also pass array if we have multiple documents to insert in DB
    
    try{
        res.status(201).json({
            status: "success",
            movie,
        });
    } catch(err) {
        res.status(404).json({
            status: "fail",
            message: err.message
        });
        console.log(`Error occured: ${err.message}`);
    }
}

exports.getMovie = async (req, res) => {
    // const movie = await Movie.find({_id: req.params.id});
    
    const movie = await Movie.findById(req.params.id);  // This is same as above line
    try{
        res.status(201).json({
            status: "success",
            data: {
                movie,
            }
        });
    } catch(err) {
        res.status(404).json({
            status: "fail",
            message: err.message
        });
        console.log(`Error occured: ${err.message}`);
    }
}

exports.updateMovie = async (req, res) => {
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})  // new returns the updated document and runValidators run all the validators that we have specified in the schema
    try{
        res.status(201).json({
            status: "success",
            data: {
                movie: updatedMovie
            }
        });
    } catch(err) {
        res.status(404).json({
            status: "fail",
            message: err.message
        });
        console.log(`Error occured: ${err.message}`);
    }
}

exports.deleteMovie = async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id);  // This is same as above line
    try{
        res.status(204).json({
            status: "success",
            data: null
        });
    } catch(err) {
        res.status(404).json({
            status: "fail",
            message: err.message
        });
        console.log(`Error occured: ${err.message}`);
    }
}

exports.getFilteredMovies = async (req, res) => {
    const filteredMovies = await Movie.find(req.query)
    console.log("Inside getFilteredMovies()");
    try{
        res.status(200).json({
            status: "success",
            data: {
                movies: filteredMovies
            }
        });
    } catch(err) {
        res.status(404).json({
            status: "fail",
            message: err.message
        });
        console.log(`Error occured: ${err.message}`);
    }
}

exports.getMovieHandler = async(req, res) => {
    if(Object.keys(req.query).length === 0) {    // If no query string is provided, execute getAllMovies() method
        this.getAllMovies(req, res);
    } else if(Object.keys(req.query).length > 0 && req.query.fields || req.query.sort || req.query.page || req.query.limit) {
        this.getAllMovies(req, res);
    } else {                                    // If query string is provided, execute getFilteredMovies() method
        this.getFilteredMovies(req, res)
    }
}

exports.getMovieStats = async (req, res) => {
    try{
        const stats = await Movie.aggregate([
            { $match: {ratings: {$gte: 4.5}}},
            { $group: {
                _id: '$releaseYear',
                avgRating: { $avg: '$ratings'},
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                priceTotal: { $sum: '$price'},
                movieCount: { $sum: 1}
            }},
            { $sort: { minPrice: 1}}
            //{ $match: {maxPrice: {$gte: 60}}}
        ]);

        res.status(200).json({
            status: 'success',
            count: stats.length,
            data: {
                stats
            }
        });
    }catch(err) {
        res.status(404).json({
            status:"fail",
            message: err.message
        });
    }
}

//   /api/v1/movies/genre




exports.genreList= async (req, res) => {
        const genre = req.params.genre;
        const movies = await Movie.aggregate([
            { $unwind: "$genres" },     // This will unwind (Destructure) the genres array and will create a document for each genre
            { $group: { 
                _id: "$genres",                // This will group all the documents having same genre
                numMovies: {$sum: 1},         // This will add 1 to numMovies field for each document and gives the total number of movies for each genre
                movies: {$push: "$name"} 
            }},                             // This will create an array of movies for each genre,
            { $addFields: { genre: "$_id"} },  // This will add a new field genre and will assign the value of _id to it
            { $project: {_id: 0}}           // This will exclude _id field from the response
            

        ])
        .then((data) => {
            res.status(200).json({
                status: "success",
                data: {
                    movies,
                }
            });
        })
        .catch(err => {
            res.status(404).json({
                status: "fail",
                message: err.message
            });
            console.log(`Error occured: ${err}`);
        })
    
}