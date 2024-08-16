# Scissor - The Next Generation URL Shortener

Scissor is a powerful URL shortening tool designed to disrupt the URL-shortening industry and compete with the likes of bit.ly and ow.ly. Scissor offers a suite of features that make it easy for users to create, customize, and track their URLs. With our platform, you'll experience the future of URL shortening.

## Features

### 1. URL Shortening
Scissor allows users to shorten long URLs with just a few clicks. Paste your long URL into the Scissor platform, and a shorter URL will be automatically generated. The shortened URL is designed to be as short as possible, making it perfect for sharing on social media, in emails, or through other channels.

### 2. Custom URLs
Scissor enables users to create custom URLs that reflect their brand or content. Choose your own custom domain name and customize the URL to suit your needs. This feature is ideal for individuals, small businesses, and marketers who want to create branded links for their campaigns.

### 3. QR Code Generation
In addition to shortening URLs, Scissor allows users to generate QR codes for their shortened links. This feature is implemented using a third-party QR code generator API integrated into the Scissor platform. Users can download the QR code image and use it in promotional materials, websites, or other digital channels.

### 4. Analytics
Scissor provides basic analytics to help users track the performance of their shortened URLs. With Scissor's analytics, you can see how many clicks your URL has received and where those clicks are coming from. This data is crucial for understanding your audience and optimizing your link-sharing strategies.

### 5. Link History
Scissor keeps a history of all the links you've created. This allows you to easily find and reuse links, saving you time and effort. The link history feature is especially useful for managing multiple campaigns or frequently used URLs.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 12.x or higher)
- [npm](https://www.npmjs.com/) (Version 6.x or higher)
- [MongoDB](https://www.mongodb.com/) or another database for storing URL data

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Ilyazlimahzah/url-2.git
Navigate to the project directory:
cd scissor

Install the dependencies:
npm install

Set up environment variables:
Create a .env file in the root directory.
Add the following environment variables:
DATABASE_URL=your_database_url
QR_CODE_API_KEY=your_qr_code_api_key
Running the Application
To start the application, run the following command:
npm start
This will start the server, and you can access Scissor at http://localhost:8000.

Deployment
For deployment, you can use services like Heroku, Render, Vercel, or AWS to host your Scissor instance.

API Endpoints
Shorten URL
POST /shorten
Request Body:
{
  "longUrl": "https://example.com/very-long-url"
}
Response:
json
Copy code
{
  "shortUrl": "https://scissor.ly/abc123"
}
Custom URL
POST /custom
Request Body:
{
  "longUrl": "https://example.com/very-long-url",
  "customSlug": "my-custom-url"
}
Response:

{
  "shortUrl": "https://yourdomain.com/my-custom-url"
}
Generate QR Code
POST /generate-qr
Request Body:
{
  "url": "https://scissor.ly/abc123"
}
Response:
The response will be a downloadable QR code image.
Analytics
GET /analytics/:shortUrl
Response:
{
  "clicks": 100,
  "referrers": {
    "google.com": 60,
    "facebook.com": 30,
    "twitter.com": 10
  }
}
Link History
GET /history
Response:
[
  {
    "longUrl": "https://example.com/very-long-url",
    "shortUrl": "https://scissor.ly/abc123",
    "createdAt": "2024-08-16T12:34:56Z"
  },
  ...
]
Contributing
We welcome contributions from the community! To contribute to Scissor, please follow these steps:

Fork the repository.
Create a new branch (git checkout -b feature-branch).
Commit your changes (git commit -m 'Add new feature').
Push to the branch (git push origin feature-branch).
Open a Pull Request.