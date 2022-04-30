// init envStatus
const envStatus = process.env.NODE_ENV

module.exports = {
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true
    },
    env: {
        API_ROOT: envStatus === "development" ? "http://localhost:3002/api/v1" : "https://nihsa-server.herokuapp.com/api/v1",
        weatherAPIKEY: '0233d84416ab4098ba0142642221202'
    },
    images: {
        domains: ['res.cloudinary.com'],
    }
}