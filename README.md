# Instagram Follower Counter

This application fetches the follower count of a specified Instagram user using Puppeteer for browser automation and Express for serving the follower count via an API.

## Prerequisites
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- Instagram account credentials (username and password)

## Setup
### Clone the Repository
```bash
git clone https://github.com/yourusername/instagram-follower-counter.git
cd instagram-follower-counter
```

### Install Dependencies Front and backend dependencies
```bash
cd /front
npm install
cd ../back
npm install
```

### Configure Environment Variables
Create a `.env` file in the `back` directory and add the following environment variables:
```
INSTAGRAM_USERNAME=yourusername
INSTAGRAM_PASSWORD=yourpassword
```
replace the values with your Instagram account credentials.

### Start the Application

```bash
cd back
npm start

cd ../front
npm run dev
```


### License
This project is licensed under the MIT License. See the LICENSE file for details.

This README provides a basic overview of how to set up, run, and use your Instagram follower counter application. Depending on the specifics of your project, you may need to adjust some steps or add additional information.