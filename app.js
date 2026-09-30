if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
};

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratgy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust1";
const MONGO_URL = process.env.ATLASDB_URL;
const PORT = process.env.PORT || 8080;
//const dbUrl=process.env.ATLASDB_URL;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const sessionOptions = {
    secret: process.env.SECRETE_KEY,
    resave: false,
    saveUninitialized: true
};



main()
    .then(() => {
        console.log("connected to DB");
    }).catch((err) => {
        console.log(err);
    })
async function main() {
    await mongoose.connect(MONGO_URL);
}


// console.log(process.env.ATLASDB_URL);

// async function testDB() {
//     try {
//         await mongoose.connect(process.env.ATLASDB_URL);
//         console.log("DB CONNECTED SUCCESSFULLY");
//     } catch (err) {
//         console.log("DB CONNECTION ERROR:");
//         console.log(err);
//     }
// }

// testDB();


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratgy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash error and success

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"delta-student",
//     });
//     let registerUser = await User.register(fakeUser,"helloworld");
//     res.send(registerUser);
//   });

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);



app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});


// Error Handling Middleware (Always Last)
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);
});

app.listen(PORT, () => {
    console.log(`server is listning to port on ${PORT}`);
});