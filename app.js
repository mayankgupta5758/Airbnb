const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const Listing = require("./models/listing.js")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const Review = require("./models/review.js")
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const dotenv = require("dotenv");
dotenv.config();

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const app = express();
const sessionOptions = {
    secret: "my supersecretkey",
    saveUninitialized: true,
    resave: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")))
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")))

main().then(() => console.log("Connect Successfully...."))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


// app.get("/", (req, res) => {
//     res.send("Hello");
// })

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/demo", async (req, res) => {
//     let fakeUser = new User({
//         email: "a@gamil.com",
//         username: "abc",
//     });

//     let reg = await User.register(fakeUser, "hello");
//     res.send(reg);
// })


// Router are a way to organize your express application such that our primary app.js file does become bloated.
app.use("/listings", listingRouter);
// jab hum ye id bhej reha hai apne parent se child me tab ye nahi jara hai to iske liya hum mergeParams ko true kar denga  const route = express.Router({ mergeParams: true });
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// middleware for erorrr
app.use("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!!!"));
})
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong!!!" } = err;
    res.status(statusCode).render("error.ejs", { err });
    // res.status(statusCode).send(message);
})

app.listen(3001, () => {
    console.log("The server is listening....");
})