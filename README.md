# IP Address Tracking API

A Node.js API that retrieves information about an IP address, including geographical location, timezone, autonomous system number (ASN), and more.

## Features

- Get geographical information (continent, country, city, latitude, longitude, postal code, etc.)
- Determine if the IP address is associated with an anonymous proxy or satellite provider
- Get Autonomous System Number (ASN) and associated organization
- Supports both querying via the client’s IP or a specified IP address

## Installation

### Prerequisites

Ensure that the following software is installed:

- **Node.js** (v14 or higher)
- **MongoDB** (for database connection)
- **GeoLite2 database files** (GeoLite2-City.mmdb and GeoLite2-ASN.mmdb)

### Steps to Install

1. Clone the repository:

    ```bash
    git clone <repository-url>
    ```

2. Navigate into the project directory:

    ```bash
    cd ip-address-tracking-api
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Set up environment variables in a `.env` file:

    ```plaintext
    MONGO_URI=mongodb://your-mongo-uri
    PORT=3000
    ```

5. Download the GeoLite2-City.mmdb and GeoLite2-ASN.mmdb files from MaxMind and place them in the root of your project folder.

6. Start the server:

    ```bash
    npm start
    ```

7. The API will be available at `http://localhost:3000`.

## API Endpoints

### `/ip-info`

**GET**  
Retrieves information about the client’s IP address.

Example response:

```json
{
  "ipAddress": "154.144.229.98",
  "continentCode": "AF",
  "continentName": "Africa",
  "countryCode": "MA",
  "countryName": "Morocco",
  "isEuMember": false,
  "city": "Rabat",
  "stateProv": "Rabat-Salé-Kénitra",
  "postalCode": "10000",
  "timeZone": "Africa/Casablanca",
  "latitude": 33.9977,
  "longitude": -6.84789,
  "accuracyRadius": 1000,
  "asNumber": 6713,
  "asName": "IAM-AS",
  "isAnonymousProxy": false,
  "isSatelliteProvider": false
}
