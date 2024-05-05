const fs = require("fs");
const mongoose = require("mongoose");

const dotenv = require("dotenv");

const Product = require("./models/product.model");

dotenv.config({ path: "./config.env" });

const DB =
    "mongodb+srv://tanbir-admin:iCKW6Q1MvJg7rLny@cluster0.ok1p4.mongodb.net/Ecom?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(DB).then(() => {
    console.log("Connected to db");
});

const products = JSON.parse(fs.readFileSync(`${__dirname}/products.json`));

const importData = async () => {
    try {
        await Product.create(products);
        console.log("Data imported to DB");
    } catch (error) {
        console.log(error);
    }

    process.exit();
};

const deleteData = async () => {
    try {
        await Product.deleteMany();
        console.log("Data deleted from DB");
    } catch (error) {
        console.log(error);
    }
    process.exit();
};

if (process.argv[2] === "--import") {
    importData();
} else if (process.argv[2] === "--delete") {
    deleteData();
}
