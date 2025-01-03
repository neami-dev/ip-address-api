const express = require("express");
const { mongoose } = require("mongoose");
const { httpStatusText } = require("./utils/httpStatusText");
const { default: appError } = require("./utils/appError");
const requestIp = require("request-ip");
const geoip = require("geoip-lite");
require("dotenv").config();
const maxmind = require('maxmind');
const path = require('path');
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
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the IP address tracking API" });
});
app.get('/ip-info', async (req, res) => {
    const clientIp = req.clientIp || '154.144.229.98';
    // const clientIp ='154.144.229.98';
      
    const cityLookup = await maxmind.open(path.resolve(__dirname, './GeoLite2-City.mmdb'));
    const asnLookup = await maxmind.open(path.resolve(__dirname, './GeoLite2-ASN.mmdb'));
    const cityData = cityLookup.get(clientIp);
    const asnData = asnLookup.get(clientIp);
   
    if (!cityData) {
        return res.status(404).json({ error: 'IP data not found.' });
    }

    const response = {
        ipAddress: clientIp,
        continentCode: cityData.continent?.code || 'Unknown',
        continentName: cityData.continent?.names?.en || 'Unknown',
        countryCode: cityData.country?.iso_code || 'Unknown',
        countryName: cityData.country?.names?.en || 'Unknown',
        isEuMember: cityData.country?.is_in_european_union || false,
        city: cityData.city?.names?.en || 'Unknown',
        stateProv: cityData.subdivisions?.[0]?.names?.en || 'Unknown',
        postalCode: cityData.postal?.code || 'Unknown',
        timeZone: cityData.location?.time_zone || 'Unknown',
        latitude: cityData.location?.latitude || 0,
        longitude: cityData.location?.longitude || 0,
        accuracyRadius: cityData.location?.accuracy_radius || 0,
        asNumber: asnData.autonomous_system_number || 'Unknown',
        asName: asnData.autonomous_system_organization || 'Unknown',
        isAnonymousProxy: cityData.traits?.is_anonymous_proxy || false,
        isSatelliteProvider: cityData.traits?.is_satellite_provider || false,
    };

    res.json(response);
});

// app.get("/ip-info", (req, res) => {
//     const clientIp = req.clientIp;
//     const geo = geoip.lookup(clientIp);
//     console.log("clientIp", clientIp);

//     if (!geo) {
//         return res.status(404).json({ error: "IP information not found." });
//     }

//     const data = {
//         ip: clientIp,
//         continent: geo.continent || "N/A", // Requires enhanced database
//         country: geo.country,
//         region: geo.region,
//         city: geo.city,
//         latitude: geo.ll[0],
//         longitude: geo.ll[1],
//         timezone: geo.timezone || "N/A", // Requires enhanced database
//     };

//     res.json(data);
// });
app.get("/ip-info/:clientIp", async (req, res) => {
    const { clientIp } = req.params;
    const cityLookup = await maxmind.open(path.resolve(__dirname, './GeoLite2-City.mmdb'));
    const asnLookup = await maxmind.open(path.resolve(__dirname, './GeoLite2-ASN.mmdb'));
    const cityData = cityLookup.get(clientIp);
    const asnData = asnLookup.get(clientIp);
   
    if (!cityData) {
        return res.status(404).json({ error: 'IP data not found.' });
    }

    const response = {
        ipAddress: clientIp,
        continentCode: cityData.continent?.code || 'Unknown',
        continentName: cityData.continent?.names?.en || 'Unknown',
        countryCode: cityData.country?.iso_code || 'Unknown',
        countryName: cityData.country?.names?.en || 'Unknown',
        isEuMember: cityData.country?.is_in_european_union || false,
        city: cityData.city?.names?.en || 'Unknown',
        stateProv: cityData.subdivisions?.[0]?.names?.en || 'Unknown',
        postalCode: cityData.postal?.code || 'Unknown',
        timeZone: cityData.location?.time_zone || 'Unknown',
        latitude: cityData.location?.latitude || 0,
        longitude: cityData.location?.longitude || 0,
        accuracyRadius: cityData.location?.accuracy_radius || 0,
        asNumber: asnData.autonomous_system_number || 'Unknown',
        asName: asnData.autonomous_system_organization || 'Unknown',
        isAnonymousProxy: cityData.traits?.is_anonymous_proxy || false,
        isSatelliteProvider: cityData.traits?.is_satellite_provider || false,
    };

    res.json(response);
})
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
