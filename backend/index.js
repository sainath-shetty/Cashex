const express = require("express");
const rootRouter = require('./routes/index');

const { User, connectDb } = require('./db');
connectDb();
const cors = require("cors");
const app = express();
// Enable preflight requests for all routes

app.use(cors({
    origin: "*", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Include OPTIONS method
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
    credentials: true, // If using cookies or other credentials
}));
app.options("*", cors()); // Handle preflight requests for all routes

app.use(express.json());


app.use("/api/v1", rootRouter);
app.get("/test", (req, res) => {
    res.send("API is working!");
});
app.listen(9000, () => {
    console.log("server started at local host 9000");
})

