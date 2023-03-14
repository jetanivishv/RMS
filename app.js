import express from "express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import session from "express-session";
import passport from "passport";
import User from "./model/user.js";
import flash from "connect-flash";
import ExpressError from "./utils/ExpressError.js";
const app = express();

// connecting with thw database
mongoose
  .connect("mongodb://localhost:27017/RMS", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected with database");
  })
  .catch((err) => {
    console.log("Error while connecting with database");
    console.log(("Errror >> ", err));
  });

app.set("view engine", "ejs");
const __dirname = dirname(fileURLToPath(import.meta.url));
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: "true" }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());

// creating the session
const sessionConfig = {
  secret: "thisshouldbeagoodlogic",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

import userRoutes from "./routes/user.js";
app.use("/", userRoutes);

import profileRoutes from "./routes/profile.js";
app.use("/", profileRoutes);

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not found"));
});

app.use((err, req, res, next) => {
  const { statusCode, message } = err;
  res.render("Error.ejs", { statusCode, message });
});

app.listen(4000, () => {
  console.log("Hey i am running at port 4000");
});
