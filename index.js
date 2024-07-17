const ngrok = require("@ngrok/ngrok");
const express = require("express");
require("./src/database/index");
const app = express();
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 8000

const User = require("./src/routers/user");
const Songs = require("./src/routers/songs");
const Like = require("./src/routers/like");

// middlewares
app.use(cors({origin: '*'}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/v1/user", User);
app.use("/api/v1/songs", Songs);
app.use("/api/v1/likes", Like);

app.use((err, req, res, next) => {
  // Check if the error is a custom error object with a status code
  if (err.statusCode) {
    return res.status(err.statusCode).json({ error: err.message });
  } else {
    // If it's not a custom error, handle it as a server error
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
})

// server
app.listen(port, async () => {
  console.log("Server Is Listening On Port: " + port);
  const listener = await ngrok.forward({ 
    addr: 8080, 
    authtoken_from_env: true, 
    domain: "infinitely-choice-cobra.ngrok-free.app" 
  });

  // Output ngrok url to console
  console.log(`Ingress established at: ${listener.url()}`);
});
