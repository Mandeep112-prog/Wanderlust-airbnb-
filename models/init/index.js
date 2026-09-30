require("dotenv").config({ path: "../../.env" });
const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../listing.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust1";
const MONGO_URL = process.env.ATLASDB_URL;
console.log(process.env.ATLASDB_URL);

main()
.then(() =>{
    console.log("connected to DB");
    
}).catch((err) =>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () =>{
   await Listing.deleteMany({});
   await Listing.insertMany(initData.data);
   console.log("data was saved");
};

initDB();