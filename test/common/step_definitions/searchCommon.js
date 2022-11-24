const { Given, When, Then } = require("@cucumber/cucumber");
const pageConstants = require("../../../page-objects/constants");
const expect = require("expect").default;
import { getCurrentWeatherByCityName } from "../../../actions/api/weather";

When("I get the current weather in {string}", async function (city) {
  const responseData = await getCurrentWeatherByCityName(city);
});
