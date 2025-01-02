const express = require("express");
const {  mongoose } = require("mongoose");
const { httpStatusText } = require("./utils/httpStatusText");
const { default: appError } = require("./utils/appError");
const requestIp = require('request-ip');
const geoip = require('geoip-lite');
require('dotenv').config()
const app = express();
const port = process.env.PORT;

// Middleware to get client's IP
app.use(requestIp.mw());
// middleware
app.use(express.json());

// connect to db
mongoose
    .connect(process.env.MONGO_URI, {
        authSource: "admin",
    })
    .then(() => {
        console.log("connected to database");
    })
    .catch((err) => {
        console.log(err);
    });

    app.get('/ip-info', (req, res) => {
        const clientIp = req.clientIp || '154.144.229.98'; // Default for testing purposes
        const geo = geoip.lookup(clientIp);
    console.log("clientIp",clientIp);
    
        if (!geo) {
            return res.status(404).json({ error: 'IP information not found.' });
        }
    
        const data = {
            ip: clientIp,
            continent: geo.continent || "N/A", // Requires enhanced database
            country: geo.country,
            region: geo.region,
            city: geo.city,
            latitude: geo.ll[0],
            longitude: geo.ll[1],
            timezone: geo.timezone || "N/A", // Requires enhanced database
        };
    
        res.json(data);
    });

// 
app.listen(port, () => {
    console.log("server listening on port", port);
});

// handle 404 errors
app.all("*", (req, res, next) => {
    const error = appError.create(
        "this resource is not available",
        404,
        httpStatusText.FAIL
    );
    return next(error);
});

app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({
        status: error.statusText || httpStatusText.ERROR,
        message: error.message,
        code: error.statusCode || 500,
        data: null,
    });
});
