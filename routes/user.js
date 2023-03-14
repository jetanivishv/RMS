import express from "express";
import User from "../model/user.js";
import AsyncCatch from "../utils/AsyncCatch.js";
import passport from "passport";
const router = express.Router();

router.get("/register", (req, res) => {
  res.render("user/register.ejs");
});

router.post(
  "/register",
  AsyncCatch(async (req, res) => {
    try {
      const { username, email, password } = req.body.user;
      const newUser = new User({
        username,
        email,
      });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", `Welcome ${req.user.username}!!!`);
        res.redirect("/");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("user/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", `Welcome ${req.user.username}!!!`);
    res.redirect("/");
  }
);

router.get("/logout", (req, res, next) => {
  const username = req.user.username;
  req.logout(function (err) {
    if (err) return next(err);
    req.flash("success", `Goodbye ${username}, see you soon!!!`);
    res.redirect("/login");
  });
});

router.get(
  "/profile/:id",
  AsyncCatch(async (req, res) => {
    const { id } = req.params;
    const foundUser = await User.findById(id);
    res.render("user/profile.ejs", {
      profile: foundUser,
    });
  })
);

router.put(
  "/profile/:id",
  AsyncCatch(async (req, res) => {
    const { id } = req.params;
    const { user } = req.body;
    const foundUser = await User.findById(id);
    foundUser.name.firstName = user.firstName;
    foundUser.name.lastName = user.lastName;
    foundUser.phoneNo = user.phoneno;
    foundUser.profileCompleted = true;
    foundUser.address.push({
      houseNo: user.houseno,
      street: user.street,
      landmark: user.landmark,
      city: user.city,
      country: user.country,
      pinCode: user.pincode,
    });

    const updatedProfile = await foundUser.save();
    req.flash(
      "success",
      `${updatedProfile.username}, Your Profile is Ready!!!`
    );
    res.redirect(`/profile/${id}`);
  })
);

export default router;
