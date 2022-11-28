const { Given, When, Then } = require("@cucumber/cucumber");
const pageConstants = require("../../../page-objects/constants");
const expect = require("expect").default;
import { getCurrentWeatherByCityName, getCurrentWeatherByCityId } from "../../../actions/api/weather";

Given("I am on the Home page", async function () {
  const home = this.pageConstructor.constructPage(pageConstants.HOME);
  await this.driver.navigateToPage(home);
  this.currentPage = home;
});

When("I search the weather in {string}", async function (city) {
  await this.currentPage.searchWeatherInCity(city);
  this.city = city;
});

Then("the search {string} shows correspondingly", async function (result) {
  const actual = await this.currentPage.getCurrentContentTitle();
  expect(actual).toContain(result);
});

When("I search the weather with invalid city", async function () {
  this.inputCity = "invalid city";
  await this.currentPage.searchWeatherInCity(this.inputCity, false);
});

Then("the not-found content is displayed", async function () {
  const isContentDisplayed = await this.currentPage.isNotFoundContentDisplay();
  expect(isContentDisplayed).toBe(true);
});

Then("the no-result notification widget is displayed", async function () {
  const isNotificationDisplayed = await this.currentPage.isNotificationWidgetDisplay();
  expect(isNotificationDisplayed).toBe(true);

  const notificationText = await this.currentPage.getNotificationWidgetText();
  expect(notificationText).toContain(`No results for ${this.inputCity}`);
});

When("I locate my location", async function () {
  await this.currentPage.locateCurrentLocation();
});

Then("the weather info should be displayed correctly", async function () {
  const actualData = await this.currentPage.getWeatherWidgetData();
  console.log(JSON.stringify(actualData));
  const responseData = await getCurrentWeatherByCityName(this.city);
  console.log(JSON.stringify(responseData.body));
  const responseData1 = await getCurrentWeatherByCityId(5128581);
  console.log(JSON.stringify(responseData1.body));

  /*const windLine = parseFloat(responseData.body.wind.speed).toFixed(0) ;
   const pressure = parseFloat(responseData.body.main.pressure).toFixed(0);
   const humidity = parseFloat(responseData.body.main.humidity).toFixed(0);
   const feels_like = parseFloat(responseData.body.main.feels_like).toFixed(0);
   const currentTemp = parseFloat(responseData.body.main.temp).toFixed(0);
   const weatherDescription = responseData.body.weather[0].description;

   expect(actualData.weatherList.windLine).toContain(windLine);
   expect(actualData.weatherList.pressure).toContain(pressure);
   expect(actualData.weatherList.humidity).toContain(humidity);
   expect(actualData.weatherDescription).toContain(feels_like);
   expect(actualData.weatherDescription).toContain(currentTemp);
   expect(actualData.currentTemperature).toContain(weatherDescription);*/
});
