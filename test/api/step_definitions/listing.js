const { Given } = require("@cucumber/cucumber");
const expect = require("expect");
const { getListVehiclesCount } = require("../../../actions/api/weather");
const { fetch } = require("../../../actions/api/getLoginToken");

Given("I send request to get vehicle count", async function () {
  const persona = {
    email: "60601-test",
    password: "taittinger",
  };
  const count = await fetch(persona);
  console.log(count);
});
