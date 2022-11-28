"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Given, When, Then } = require("@cucumber/cucumber");
const pageConstants = require("../../../page-objects/constants");
const expect = require("expect").default;
const weather_1 = require("../../../actions/api/weather");
When("I get the current weather in {string}", async function (city) {
    const responseData = await (0, weather_1.getCurrentWeatherByCityName)(city);
});
//# sourceMappingURL=searchCommon.js.map