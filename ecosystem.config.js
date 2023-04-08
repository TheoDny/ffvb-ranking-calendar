module.exports = {
    apps: [{
        name: "unofficial-ffvb-calendar",
        script: "./dist/index.js",
        env: {
            NODE_ENV: "development",
            APP_URL: "http://localhost",
            PORT: "8080",
            URL_FFVB: "https://www.ffvbbeach.org/ffvbapp/resu/vbspo_calendrier.php"
        },
        env_production: {
            NODE_ENV: "production",
            LOG_ROTATE_SIZE: "100k",
        }
    }]
}