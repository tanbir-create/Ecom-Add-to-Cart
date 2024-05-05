const mongoose = require("mongoose");

const config = require("./config/config");

module.exports = async () => {
    try {
        mongoose
            .connect(config.mongo.uri)
            .then(
                () => {},
                (err) => {
                    console.info("MongoDB error", err);
                }
            )
            .catch((err) => {
                console.log("ERROR", err);
            });

        mongoose.connection.on("connected", () => {
            console.info("Connected to MongoDB");
        });

        mongoose.connection.on("reconnected", () => {
            console.info("MongoDB reconnected");
        });

        mongoose.connection.on("error", (error) => {
            console.error(`Error in MongoDb connection: ${error}`);
            mongoose.disconnect();
        });

        mongoose.connection.on("disconnected", () => {
            console.error(`MongoDB disconnected!`);
        });
    } catch (error) {
        console.log("Error connecting to database", error);
    }
};
