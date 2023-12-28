const Movie = require("./../Models/movieModel");
const express = require("express");
const app = express();

app.use(express.json());       // To parse the request body and get the request body

exports.getAllMovies = async (req, res) => {
    const movies = await Movie.find();
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

