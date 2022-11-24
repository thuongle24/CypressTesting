const Login = require("./pages/LoginPage");
const Home = require("./pages/HomePage");
const Search = require("./pages/SearchPage");
const pageConstants = require("./constants");

module.exports = [
  { name: pageConstants.LOGIN, page: Login },
  { name: pageConstants.HOME, page: Home },
  { name: pageConstants.SEARCH, page: Search },
];
