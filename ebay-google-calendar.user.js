// ==UserScript==
// @name         Add Ebay Auctions to Google Calendar
// @namespace    https://github.com/dwbfox
// @version      0.1.4
// @description  Add Ebay Auction Deadlines to Google Calendar
// @author       dwbfox
// @updateURL    https://raw.githubusercontent.com/dwbfox/ebay-auction-google-calendar/master/ebay-google-calendar.user.js
// @license      GPLv3
// @match        http://www.ebay.com/itm/*
// @run-at       document-end
// ==/UserScript==
(function () {
    'use strict';

    // Calendar services we can send
    // the auction deadline to
    var services = {
        "windowslive": {
            "name": "Windows Live Outlook",
            "callback": generateLiveLink,
            "dateRegex": /-|:|\.'/g
        },
        "google": {
            "name": "Google Calendar",
            "callback": generateGcalLink,
            "dateRegex": /-|:|\.\d{3}/g
        }
    };

    // @TODO Make this a user-editable option
    var defaultService = services.google;

    /**
     * Gets the auction end date.
     *
     * @method     getAuctionEndDate
     * @return     {Date} date object with of the auction end date
     */
    function getAuctionEndDate() {
        var endDate = new Date();
        endDate.setTime(document.querySelector('.timeMs').getAttribute('timems'));
        return endDate.toISOString().replace(defaultService.dateRegex, '');
    }


    /**
     * Generates the Google Calendar link.
     *
     * @method     generateGcalLink
     * @return     {string}  the URL to create the calendar event
     */
    function generateGcalLink() {
        var eventDate = getAuctionEndDate();
        var eventName = 'Auction for ' + document.querySelector('#itemTitle').innerText + ' ends.\n\n';
        var eventDetail = eventName + ' ' + window.location.href;
        return encodeURI('https://www.google.com/calendar/render?action=TEMPLATE&text=' + eventName +
            '&dates=' + eventDate + '/' + eventDate + '&details=' + eventDetail + '&location=');
    }


    /**
     * Generates the Windows Live/Outlook formatted link
     *
     * @method     generateLiveLink
     * @return     {string}  the URL to create the calendar event
     */
    function generateLiveLink() {
        var eventDate = getAuctionEndDate();
        var eventName = 'Auction for ' + document.querySelector('#itemTitle').innerText + ' ends.\n\n';
        var eventDetail = eventName + ' ' + window.location.href;
        return encodeURI('http://calendar.live.com/calendar/calendar.aspx?rru=addevent&eventtitle=' + eventName + '&dstart=' + eventDate + '&dend=' + eventDate + '&summary=' + eventName + '&location=');
    }

    /**
     * Renders the button on the page
     *
     * @method     renderButton
     */
    function renderButton() {
        // Outer div
        var container = document.createElement('div');
        container.setAttribute('id', 'gAddToCalendar');

        // Render button
        var button = document.createElement('a');
        button.setAttribute('class', 'btn btn-ter');
        button.innerText = 'Add to ' + defaultService.name;
        button.setAttribute('style', 'margin-top: 3px;');

        // Add links
        // In the future, this would be set dynamically per issue #1
        var calLink = defaultService.callback();
        button.setAttribute('href', calLink);
        button.setAttribute('role', 'button');
        button.setAttribute('target', '_blank');

        // Insert into doc
        container.appendChild(button);
        document.querySelector('.vi-tm-left').appendChild(container);
        return button;
    }

    renderButton();
})();
