const Login = require("./pages/LoginPage");
const Home = require("./pages/HomePage");
const pageConstants = require("./constants");

module.exports = [
  { name: pageConstants.LOGIN, page: Login },
  { name: pageConstants.HOME, page: Home },
];
