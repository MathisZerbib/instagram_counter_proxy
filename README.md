# Instagram Follower Counter

This application fetches the follower count of a specified Instagram user using Puppeteer for browser automation and Express for serving the follower count via an API.

## Prerequisites
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- Instagram account (username)

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

Please note that this is for educational purposes only and I am not responsible for the use you make of the code.

```
// Copyright (c) 2024 Mathis Zerbib
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE. FOR EDUCATIONAL PURPOSE ONLY !
```
