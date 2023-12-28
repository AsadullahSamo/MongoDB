// process.argv is an array of all the command line arguments that were used when the process was started
console.log(process.argv[2])     // use "node import-dev--data.js --import"   and notice that --import is the 3rd command line argument and at index 2 or last
// node import-dev--data.js --import --delete // (--delete will be the 4th command line argument and at index 3 or last)