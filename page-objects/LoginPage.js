const PageObject = require("./PageObject");

class LoginPage extends PageObject {
    constructor(driver, pageConstructor) {
        super(driver, pageConstructor);
        this.url = `${this.baseUrl}/account/logon`;
        this.usernameSelector = '#LogOnModel_UserName';
        this.passwordSelector = '#LogOnModel_Password';
        this.signInSelector = '#LoginSubmit';
     }

    getUrl(){
        return this.url;
    }
}
module.exports=LoginPage;