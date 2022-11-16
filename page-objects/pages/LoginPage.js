const PageObject = require("../PageObject");

class LoginPage extends PageObject {
  constructor(driver, pageConstructor) {
    super(driver, pageConstructor);
    this.url = `${this.baseUrl}/account/logon`;
    this.usernameSelector = '#LogOnModel_UserName';
    this.passwordSelector = '#LogOnModel_Password';
    this.signInSelector = '#LoginSubmit';
  }

  async inputLoginCredentials() {
    //await this.driver.setText(this.usernameSelector, "abc");
    //await this.driver.setText(this.passwordSelector, "abc");
  }
}

module.exports = LoginPage;
