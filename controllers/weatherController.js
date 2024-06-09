const http = require('http');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const options = {
            hostname: 'api.openweathermap.org',
            port: 80,
            path: '/data/2.5/weather?q=Seoul&appid=dcab13247963ad08547e263eb9f380ee&units=metric',
            method: 'GET'
        };

        const request = http.request(options, (apiRes) => {
            let data = '';
            apiRes.on('data', (chunk) => {
                data += chunk;
            });
            apiRes.on('end', () => {
                const weatherData = JSON.parse(data);
                res.render('getWeather', { weatherData });
            });
        });

        request.on('error', (error) => {
            console.error('Error:', error);
            res.render('getWeather', { error: 'Error fetching weather data' });
        });

        request.end();
    } catch (error) {
        console.error('Error fetching weather:', error);
        res.render('getWeather', { error: 'Error fetching weather data' });
    }
});

module.exports = router;

