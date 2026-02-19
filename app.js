const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

const predictRoutes = require("./routes/predict");
const auth = require("./routes/auth");

const app = express();

/* ================= APP CONFIG ================= */
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "stockholms_secret_key",
    resave: false,
    saveUninitialized: false
  })
);

/* ================= AUTH ROUTES ================= */

// Login page
app.get("/login", (req, res) => {
  res.render("login");
});

// Login submit
 app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // 🔐 Predefined users (username : password)
  const users = {
    admin: "1234",
    navaneeth: "nav123",
    manojna: "m@333",
    ashwail: "fahhh",
    demo: "demo123",
    trader: "trade@123",
    guest: "guest"
  };

  if (users[username] && users[username] === password) {
    req.session.user = { username };
    return res.redirect("/home");
  }

  res.render("login", { error: "Invalid credentials" });
});


// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

/* ================= PROTECTED ROUTES ================= */

// Home
app.get("/home", auth, (req, res) => {
  res.render("home", { user: req.session.user });
});

// About
app.get("/about", auth, (req, res) => {
  res.render("about", { user: req.session.user });
});

// Account
app.get("/account", auth, (req, res) => {
  res.render("account", { user: req.session.user });
});

// Predict (router)
app.use("/predict", auth, predictRoutes);

/* ================= DEFAULT ================= */

// Root redirect
app.get("/", (req, res) => {
  res.redirect("/home");
});

/* ================= SERVER ================= */
app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});

