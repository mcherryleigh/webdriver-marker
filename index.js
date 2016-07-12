let _ = require('lodash');
/** Class representing a Marker. */
class Marker {
    /**
     * Create a marker.
     * @param {WebDriver} driver - The webdriver instance controlling the session you want to highlight element in.
     * @param {{background: string, border: string, showFor: number}} preferences - preferences object to be used for all calls to highlight without locally overridden preferences. Background and border keys both accept css string arguments as the value. showFor is an integer in milliseconds.
     */
    constructor(driver, preferences){
        //passing in the driver gives access to findElement, etc. used below
        this.driver = driver;
        //constructor accepts preferences object that matches this structure, if the keys exist, the will override the default values
        this.preferences = _.defaults(preferences,{
            background: 'yellow',
            border: ' 2px solid red',
            showFor: 300,
        });
        this.previousStyles = [];
    }

    /**
     * Highlight a single element for either the global showFor value or the local one if it has been passed as an argument. Same is true for background and border preferences.
     * @param {By} selObj - an object like {id:'something'} or using By By.id('something'). Accepts classname, css, id, js, linkText, name, partialLinkText, tagName, xpath locator strategies
     * @param {{background: string, border: string, showFor: number}} LocalPrefs - preferences object to be used when overriding global preferences for the Marker. Background and border keys both accept css string arguments as the value. showFor is an integer in milliseconds.
     * @return {WebElement} The WebElement located by selObj
     */
    highlightElementFor(selObj, localPrefs){
        var prefs = _.defaults(localPrefs, this.preferences)
        var el = this.driver.findElement(selObj)
        //Accepts 'el' as an argument. gets its initial styles if any
        //Applies background and border css from prefs obj
        //If the element had a style property it is restored, if not we infer it was null and use an empty string instead
        this.driver.executeScript(`
            var element = arguments[0];
            var originalStyle = element.getAttribute('style');
            element.setAttribute('style', originalStyle + "; background: ${prefs.background}; border: ${prefs.border};");
            setTimeout(function(){
                element.setAttribute('style', ((originalStyle===undefined) ? "" : originalStyle));
            }, ${prefs.showFor});
            `, el)
        return el;
    }

    /**
     * Highlight a single element for either the global or local background and border preferences. Stores original style property values to Marker.previousStyles so they can be reapplied when the highlight is removed
     * @param {By} selObj - an object like {id:'something'} or using By By.id('something'). Accepts classname, css, id, js, linkText, name, partialLinkText, tagName, xpath locator strategies
     * @param {{background: string, border: string, showFor: number}} LocalPrefs - preferences object to be used when overriding global preferences for the Marker. Background and border keys both accept css string arguments as the value. showFor is an integer in milliseconds.
     * @return {WebElement} The WebElement located by selObj
     */
    highlightElement(selObj, localPrefs){
        var prefs = _.defaults(localPrefs, this.preferences)
        var el = this.driver.findElement(selObj)
        var originalStyle = this.driver.executeScript(`
            var element = arguments[0];
            var originalStyle = element.getAttribute('style');
            element.setAttribute('style', originalStyle + "; background: ${prefs.background}; border: ${prefs.border};");
            return originalStyle;
            `, el);
        if(_.includes(this.previousStyles, selObj)){
            this.previousStyles.push({
                selector: selObj,
                originalStyle: originalStyle
            })
        } else {
            this.previousStyles = _.reject(this.previousStyles, {selector: selObj}).push({
                selector: selObj,
                originalStyle: originalStyle
            });
        }
        return el;
    }

    /**
     * Highlights an array of WebElements for either the global or local background and border preferences. Stores original style property values to Marker.previousStyles so they can be reapplied when the highlight is removed
     * @param {{background: string, border: string, showFor: number}} LocalPrefs - preferences object to be used when overriding global preferences for the Marker. Background and border keys both accept css string arguments as the value. showFor is an integer in milliseconds.
     * @param {Array.<By>} selObj - an object like {id:'something'} or using By By.id('something'). Accepts classname, css, id, js, linkText, name, partialLinkText, tagName, xpath locator strategies
     */
    highlightElements(selArr, localPrefs){
        var self = this;
        selArr.forEach(function(selObj){
            self.highlightElement(selObj, localPrefs)
        })
    }

    /**
     * Remove the highlight style from a single element. Attempts to reapply the original style property values from Marker.previousStyles but falls back to an empty string if it cannot.
     * @param {By} selObj - an object like {id:'something'} or using By By.id('something'). Accepts classname, css, id, js, linkText, name, partialLinkText, tagName, xpath locator strategies
     * @return {WebElement} The WebElement located by selObj
     */
    removeHighlight(selObj){
        var el = this.driver.findElement(selObj)
        var originalStyle = _.filter(this.previousStyles, {selector: selObj})
        this.driver.executeScript(`
            var element = arguments[0];
            setTimeout(function(){element.setAttribute('style', ((arguments[1]===undefined || arguments[1]===null) ? "" : arguments[1]))});`, el, originalStyle)
        this.previousStyles = _.reject(this.previousStyles, {selector: selObj}).push({
            selector: selObj,
            originalStyle: originalStyle
        });
        return el;
    }

    /**
     * Remove the highlight styles from an array of elements
     * @param {Array.<By>} selObj - an object like {id:'something'} or using By By.id('something'). Accepts classname, css, id, js, linkText, name, partialLinkText, tagName, xpath locator strategies
     */
    removeHighlights(selArr){
        var self = this;
        selArr.forEach(function(selObj){
            self.removeHighlight(selObj)
        })
    }
}

exports.module = Marker;
