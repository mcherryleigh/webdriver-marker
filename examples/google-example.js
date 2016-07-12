var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .usingServer('http://192.168.99.100:4444/wd/hub')//used for my docker container can comment out for localhost or change
    .build();

var Marker = require('../index.js')
//var Marker = require('webdriver-marker')
//regular marker with no additions to the default preferences
var defaultMarker = new Marker(driver);
//greenMarker gets created with overrides default prefs for EVERY time it is called
var greenMarker = new Marker(driver, {background:'green', showFor:5000})

driver.get('http://www.google.com');
//greenMarker is overridden again locally here with a different border. This change is in effect only for this single call
greenMarker.highlightElements([By.name('q'), {name:'btnG'}], {border:'5px solid black'});
driver.findElement(By.name('q')).sendKeys('webdriver');
driver.sleep(1000)
//remove just the button's greenMarker style
greenMarker.removeHighlight(By.name('btnG'))
driver.sleep(1000)
//add the default greenMarker style then automatically remove them after 2000ms
greenMarker.highlightElementFor(By.name('btnG'), {showFor:2000})
driver.sleep(5000)
//defaultMarker runs with the styles from the class constructor
defaultMarker.highlightElement({name:'btnG'}).click();
//remove the default styles
defaultMarker.removeHighlight(By.name('btnG'))
driver.wait(until.titleIs('webdriver - Google Search'), 1000);
driver.sleep(10000)
driver.quit();