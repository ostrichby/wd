var username = process.env.BROWSERSTACK_USERNAME || "BROWSERSTACK_USERNAME";
var accessKey = process.env.BROWSERSTACK_ACCESS_KEY || "BROWSERSTACK_ACCESS_KEY";

require('colors');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
chai.should();

var wd = require('wd');

// enables chai assertion chaining
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

var browser = wd.promiseChainRemote("hub.browserstack.com", 80, username, accessKey);

// optional extra logging
browser.on('status', function(info) {
  console.log(info.cyan);
});
browser.on('command', function(eventType, command, response) {
  console.log(' > ' + eventType.cyan, command, (response || '').grey);
});
browser.on('http', function(meth, path, data) {
  console.log(' > ' + meth.magenta, path, (data || '').grey);
});

var desired = {
  os: 'Windows',
  os_version: '',
  browser: 'ie',
  browser_version: '',
  project: "examples",
  name: "This is an example test with promises",
  build: "WD BrowserStack Sample Test"
};

browser
  .init(desired)
  .get("http://admc.io/wd/test-pages/guinea-pig.html")
  .title()
    .should.become('WD Tests')
  .elementById('i am a link')
  .click()
  .eval("window.location.href")
    .should.eventually.include('guinea-pig2')
  .fin(function() { return browser.quit(); })
  .done();
