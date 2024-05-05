const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const hpp = require("hpp");
const morgan = require("morgan");
const xss = require("xss-clean");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");

const appRouter = require("./routes/index");
const config = require("./config/config");
const globalErrorHandler = require("./middlewares/globalErrorMiddleware");
const AppError = require("./utils/AppError");
const viewRouter = require("./routes/view.router");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.set("trust proxy", 1);

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

app.use(helmet());

app.use(
    helmet.contentSecurityPolicy({
        useDefaults: true,
        directives: {
            // for loading external images for map using leaflet
            imgSrc: ["'self'", "https: data:"],
            scriptSrc: [
                "'self'",
                "https://cdn.tailwindcss.com",
                "https://cdnjs.cloudflare.com/ajax/libs/axios/1.6.8/axios.min.js",
            ],
        },
    })
);

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// for nosql injection and xss attacks
app.use(mongoSanitize());
app.use(xss());

app.use(
    session({
        store: MongoStore.create({ mongoUrl: config.mongo.uri }),
        resave: false, // required: force lightweight session keep alive (touch)
        saveUninitialized: true, // recommended: only save session when data exists
        secret: "keyboard cat",
        maxAge: 30 * 24 * 3600 * 1000,
        rolling: true,
        cookie: {
            // Domain: "http://localhost",
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            maxAge: 30 * 24 * 3600 * 1000,
            // sameSite: "None",
            path: "/",
        },
    })
);

app.use("/", viewRouter);
app.use("/api/v1/", appRouter);

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// This is a middleware that handles all error in the app
// When next(err) is called, Express looks for error-handling middleware that matches the signature (err, req, res, next).
// The next(err) function triggers the execution of the globalErrorHandler middleware, skipping any regular middleware that may be defined after it

// uncaught exception and unhandled rejection errors are handled in server using process module
app.use(globalErrorHandler);

module.exports = app;
