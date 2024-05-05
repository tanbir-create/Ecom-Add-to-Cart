const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const config = require("./config/config");

const connectDB = require("./connectDB");

process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION..........Shutting down");
    console.error(err);
    process.exit(1);
});

const app = require("./app");

connectDB();

const PORT = config.port;
const server = app.listen(PORT, () => {
    console.log("Server started on port ", PORT);
});

process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION..........Shutting down");
    console.log(err);
    server.close(() => {
        process.exit(1);
    });
});
