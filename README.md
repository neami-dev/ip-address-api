# IP Address Tracking API

A Node.js API that retrieves information about an IP address, including geographical location, timezone, autonomous system number (ASN), and more.

## Service Link

You can access the IP address tracking API at the following URL:

[https://ip-address-api-tuhx.onrender.com/](https://ip-address-api-tuhx.onrender.com/)

## API Endpoints

### 1. `/ip-info`

**GET**  
This endpoint retrieves information about the **client's IP address** (the IP from which the request is sent). No parameters are needed.

**Example Request:**

```bash
GET https://ip-address-api-tuhx.onrender.com/ip-info
```
### 2. `/ip-info/:ip-address`

**GET**  
This endpoint retrieves information about a specified IP address. 

**Example Request:**

```bash
GET https://ip-address-api-tuhx.onrender.com/ip-info/154.144.229.98
