const PageObject = require("./PageObject");
const config = require("config");

class LoginPage {
    constructor(driver) {
        this.driver = driver;
        this.url = config.get("baseUrl") + '/account/logon'
        this.usernameSelector = '#LogOnModel_UserName';
        this.passwordSelector = '#LogOnModel_Password';
        this.signInSelector = '#LoginSubmit';
     }

    getUrl(){
        return this.url;
    }

    async inputInvalidCredentials() {
       // await this.driver.setText(this.usernameSelector, "test");
       // await this.driver.setText(this.passwordSelector, "test");
    }
}
module.exports=LoginPage;