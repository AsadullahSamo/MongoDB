const dotenv = require('dotenv');
dotenv.config({ path: "../config.env" });
const movieController = require("../Controllers/movieController")
const Movie = require("../Models/movieModel");
const mongoose = require('mongoose');
const fs = require('fs');

const express = require("express");
const app = express();




// process.argv is an array of all the command line arguments that were used when the process was started
console.log(process.argv[2])     // use "node import-dev--data.js --import"   and notice that --import is the 3rd command line argument and at index 2 or last
// node import-dev--data.js --import --delete // (--delete will be the 4th command line argument and at index 3 or last)


mongoose.connect(process.env.CON_STR)
.then(con => console.log('DB connection successful!'))
.catch(err => console.log("Error connecting to MongoDB", err.message));

// READ JSON FILE
if(process.argv[2] === '--import') {
    Movie.find()
    .then((movies) => {
        console.log(movies)
        fs.writeFile('./movies.json', JSON.stringify(movies), err => {
            console.log('Data successfully loaded!');
            console.log(err);
        });
    })
    .catch((err) => console.log(`Error occured: ${err.message}`))
    // IMPORT DATA INTO DB
    
} else if(process.argv[2] === '--delete') {
   // DELETE ALL DATA FROM DB
    Movie.deleteMany({}).then(() => {
        console.log('Data successfully deleted!');
        process.exit();
    }
    ).catch(err => {
        console.log(err);
    });
}


const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
