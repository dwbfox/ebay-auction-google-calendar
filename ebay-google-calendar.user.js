// ==UserScript==
// @name         Add Ebay Auctions to Google Calendar
// @namespace    https://github.com/dwbfox
// @version      0.1
// @description  Add Ebay Auction Deadlines to Google Calendar
// @author       dwbfox
// @license      GPLv3
// @match        http://www.ebay.com/itm/*
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Gets the auction end date.
     *
     * @method     getAuctionEndDate
     * @return     {Date} date object with of the auction end date
     */
    function getAuctionEndDate() {
        var endDate = new Date();
        endDate.setTime(document.querySelector('.timeMs').getAttribute('timems'));
        return endDate.toISOString().replace(/-|:|\.\d{3}/g,'');
    }


    /**
     * Generates the Google Calendar link.
     *
     * @method     generateGcalLink
     * @return     {string}  the URL to create the Google calendar event
     */
    function generateGcalLink() {
        var eventDate = getAuctionEndDate();
        var eventName = 'Auction for ' + document.querySelector('#itemTitle').innerText + ' ends.\n\n';
        var eventDetail = eventName + ' ' + window.location.href;
        return encodeURI('https://www.google.com/calendar/render?action=TEMPLATE&text=' + eventName +
                         '&dates=' + eventDate + '/' + eventDate + '&details=' + eventDetail + '&location=');
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
        button.setAttribute('class', 'btn btn-prim');
        button.innerText = 'Add to Google Calendar';
        button.setAttribute('style', 'margin-top: 3px;');

        // Add links
        var calLink = generateGcalLink();
        button.setAttribute('href', calLink);
        button.setAttribute('target', '_blank');

        // Insert into doc
        container.appendChild(button);
        document.querySelector('.vi-tm-left').appendChild(container);
        return button;
    }

    window.onload = function() {
        renderButton();
    };

})();
