/**
 * This module contains methods for reading and writing data contained within the pokemon-db.json and type-data-db.json files.
 */

const fs = require("fs");


// function loadUserData() {
//     const jsonString = fs.readFileSync("./data/user-db.json", "utf-8");
//     return JSON.parse(jsonString);
// }


// function saveUserData(userData) {
//     const jsonString = JSON.stringify(userData);
//     fs.writeFileSync("./data/user-db.json", jsonString);
// }


function validateUserData(user) {
    if (!user.fname) {
        throw "no first name!";
    }
    if (!user.lname) {
        throw "no last name!";
    }
    if (!user.username) {
        throw "no username!";
    }
    if (!user.password) {
        throw "no password!";
    }
    if (!user.DOB) {
        throw "no date of birth!";
    }
    if (!user.imageUrl) {
        throw "no imageUrl!";
    }
    if (!user.email) {
        throw "no email!";
    }
    if (user.gender === undefined) {
        throw "undefined gender!";
    }
    if (user.country === undefined) {
        throw "undefined country!";
    }
    if (isNaN(user.phoneNum)) {
        throw "Supplied phone number is not a number!";
    }

    return {
        fname: user.fname,
        lname: user.lname,
        imageUrl: user.imageUrl,
        DOB: user.DOB,
        gender: user.gender,
        phoneNum: user.phoneNum,
        email: user.email,
        country: user.country,
        username: user.username,
        password: user.password
    }
}

// // Load the pokemon data initially.
// const pokemonData = loadPokemonData();
// const typeData = loadTypeData();

// // Gets the number of Poke'mon.
// function getNumPokemon() {
//     return pokemonData.length;
// }

// // Gets all Poke'mon data.
// function getAllPokemon() {
//     return [...pokemonData]; // Returns a copy of the array.
// }

// // Gets the Poke'mon with the given id. See the JavaScript documentation for the Array find() function for details.
// function getPokemonById(id) {
//     return pokemonData.find(function(pokemon) {
//         return pokemon.id == id;
//     });
// }

// // Gets the Poke'mon at the given array index.
// function getPokemonByArrayIndex(index) {
//     return pokemonData[index];
// }

// // Adds the given pokemon to the list, sorts it by id, and then saves the list back to the file.
// function addPokemon(pokemon) {

//     // This code will validate the supplied Poke'mon. If anything invalid is found,
//     // an exception will be thrown.
//     pokemon = validatePokemon(pokemon);

//     pokemonData.push(pokemon);
//     pokemonData.sort(function(p1, p2) {
//         return p1.id - p2.id;
//     });
//     savePokemonData(pokemonData);
// }

// // Gets the type data that was contained within the file
// function getTypeData() {
//     return typeData;
// }

// Export the following functions so they can be accessed outside of this file by
// using require().
module.exports = {
    validateUserData
};