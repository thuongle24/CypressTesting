"use strict";
const request = require("supertest");
const config = require("config");
const BASE_URL = config.get("env.apiUrl");
const apiKey = config.get("personas.account1.apiKey");
function getCurrentWeatherByLatLon(lat, lon, unit = "metric") {
    return request(`${BASE_URL}`)
        .get(`/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`)
        .set("Content-Type", "application/json");
}
function getCurrentWeatherByCityName(city, countryCode = null, stateCode = null, unit = "metric") {
    let searchString = city;
    if (countryCode !== null)
        searchString += `,${countryCode}`;
    if (stateCode !== null)
        searchString += `,${stateCode}`;
    return request(`${BASE_URL}`)
        .get(`/data/2.5/weather?q=${searchString}&appid=${apiKey}&units=${unit}`)
        .set("Content-Type", "application/json");
}
function getCurrentWeatherByCityId(id, unit = "metric") {
    return request(`${BASE_URL}`)
        .get(`/data/2.5/weather?id=${id}&appid=${apiKey}&units=${unit}`)
        .set("Content-Type", "application/json");
}
module.exports = { getCurrentWeatherByLatLon, getCurrentWeatherByCityName, getCurrentWeatherByCityId };
//# sourceMappingURL=weather.js.map