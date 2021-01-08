/** @format */

const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const config = require("config");
const mongoose = require("mongoose");

let db = config.get("db");

mongoose
  .connect(db)
  .then(() => console.log(`Connected to ${db}`))
  .catch((er) => console.log("Could not Connect\n", er));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());

// Register Routes and Models
app.use("/api/user", require("./routes/user"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/driver", require("./routes/driver"));

// Authentication Routes
app.use("/api/adminAuth", require("./routes/Authentications/adminAuth"));
app.use("/api/driverAuth", require("./routes/Authentications/driverAuth"));
app.use("/api/userAuth", require("./routes/Authentications/userAuth"));

const PORT = process.env.PORT || 9001;
app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
