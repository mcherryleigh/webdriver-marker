#Webdriver-Marker
###Summary
Webdriver-Marker is a selenium-webdriver utility module for adding border and background styling to WebElements while running a selenium-based script. It has currently only been tested against drivers generated by the Builder class of selenium-webdriver
###TODO: Class Docs
index.js currently has jsdoc comments on the file itself until I get something hooked up to generate the md
###Code Examples
#####Creating an instance of Marker and applying universal styles for the instance
    var webdriver = require('selenium-webdriver'),
        By = webdriver.By,
        until = webdriver.until;
    
    var driver = new webdriver.Builder()
        .forBrowser('chrome')
        .usingServer('http://192.168.99.100:4444/wd/hub')//used for my docker container can comment out for localhost or change
        .build();
    
    //regular marker with no additions to the default preferences
    var defaultMarker = new Marker(driver)
    //greenMarker gets created with overrides default prefs for EVERY time it is called
    var greenMarker = new Marker(driver, {background:'green', showFor:5000})

#####Highlight elements for a short time then automatically remove the highlight
    var defaultMarker = new Marker(driver)
    driver.get('http://www.google.com');
    defaultMarker.highlightElementFor(By.name('q')).sendKeys('webdriver');
    driver.sleep(5000)
    defaultMarker.highlightElementFor({name:'btnG'}).click();
    driver.wait(until.titleIs('webdriver - Google Search'), 1000);
    driver.sleep(10000)
    driver.quit();
    
#####Highlight elements until the styles are explicitly removed
    var defaultMarker = new Marker(driver)
    driver.get('http://www.google.com');
    defaultMarker.highlightElement(By.name('q')).sendKeys('webdriver');
    driver.sleep(5000)
    defaultMarker.removeHighlight(By.name('q'));
    defaultMarker.highlightElement({name:'btnG'}).click();
    driver.wait(until.titleIs('webdriver - Google Search'), 1000);
    driver.sleep(5000)
    defaultMarker.removeHighlight({name:'btnG'});
    driver.quit();
    
#####Using different Markers/styles in the same script
    var defaultMarker = new Marker(driver)
    driver.get('http://www.google.com');
    defaultMarker.highlightElementFor(By.name('q')).sendKeys('webdriver');
    driver.sleep(5000)
    greenMarker.highlightElementFor({name:'btnG'}).click();
    driver.wait(until.titleIs('webdriver - Google Search'), 1000);
    driver.sleep(10000)
    driver.quit();