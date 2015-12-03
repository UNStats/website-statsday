/* Get the query strings from the URL  ----------------------------------------- */
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

/* Filtering by country, international organisation and other organisations ------ */
$(function () {
    /* Read all posts in the JSON file  */
    $.getJSON('js/events.json', function (data) {
        var template = $('#events-template').html();
        var detailsTemplate = $('#details-template').html();
        var datesTemplate = $('#dates-template').html();
        var events = data.events;
        
        /* Function to get the year from the date string into its own property */
        var getYear = function (event) {
            event.year = function () {
                return event.start.slice(0, 4);
            };
            return event;
        };
        
        /* Function to convert the markdown into HTML using the Lodash library */
        var addHtml = function (event) {
            event.html = function () {
                return markdown.toHTML(this.description);
            };
            return event;
        };
        
        //Call function to add year property
        events = events.map(getYear);
        // Group by years
        var eventYears = _(events).map(function(event) { return event.year(); }).uniq().value();
         
                    
        /* Call function getParameterByName to get the query strings and assign them to a variable [array] */
        /* Location  */
        var l = getParameterByName('l');
        /* Tag */
        var t = getParameterByName('t');
        /* Event type */
        var ty = getParameterByName('ty');
        /* date */
        var d = getParameterByName('d');
        /* ID */
        var i = getParameterByName('i');
        
        /* Call function add HTML to markdown */
        events = events.map(addHtml);
        
        /* If location */
        if (l !== '') {
            /* Get all events by location */
            events = _.where(data.events, { 'city': l });
        }
        
        /* If tag */
        if (t !== '') {
            /* Get all events by tag */
            events = _.where(data.events, { 'tags': [t] });
        }
        
        /* If location */
        if (ty !== '') {
            /* Get all events by location */
            events = _.where(data.events, { 'type': ty });
        }
        
        /* If date */
        if (d !== '') {
            /* Get all events by date */
            events = _.filter(data.events, function(ev) { return _.startsWith(ev.start, d); }); 
        }
        
        //Load years into datesTemplate
        var items = Mustache.to_html(datesTemplate, eventYears);
        $('#dates').html(items); 

        //Load events into events template
        items = Mustache.to_html(template, events);
        $('#events').html(items);
                
        /* If ID, display only information for the relevant event */
        if (i !== '') {
            /* Get all events by date */
            events = _.where(data.events, { 'id': i });
            items = Mustache.to_html(detailsTemplate, events);
            $('#event-details').html(items);
            $('#events').addClass("hide");
        }

        //Only show the first paragraph in the overview page, hide all the others
        $('article').each(function(){ $(this).find('p:not(:first)').hide()});


        /* Format event dates */
        jQuery(function () {
            var shortDateFormat = 'dd MMM yyyy';

            jQuery(".shortDateFormat").each(function (idx, elem) {
                if (jQuery(elem).is(":input")) {
                    jQuery(elem).val(jQuery.format.date(jQuery(elem).val(), shortDateFormat));
                } else {
                    jQuery(elem).text(jQuery.format.date(jQuery(elem).text(), shortDateFormat));
                }
            });

            var dayDateFormat = 'dd';

            jQuery(".dayDateFormat").each(function (idx, elem) {
                if (jQuery(elem).is(":input")) {
                    jQuery(elem).val(jQuery.format.date(jQuery(elem).val(), dayDateFormat));
                } else {
                    jQuery(elem).text(jQuery.format.date(jQuery(elem).text(), dayDateFormat));
                }
            });

            var monthDateFormat = 'MMMM';

            jQuery(".monthDateFormat").each(function (idx, elem) {
                if (jQuery(elem).is(":input")) {
                    jQuery(elem).val(jQuery.format.date(jQuery(elem).val(), monthDateFormat));
                } else {
                    jQuery(elem).text(jQuery.format.date(jQuery(elem).text(), monthDateFormat));
                }
            });

            var yearDateFormat = 'yyyy';

            jQuery(".yearDateFormat").each(function (idx, elem) {
                if (jQuery(elem).is(":input")) {
                    jQuery(elem).val(jQuery.format.date(jQuery(elem).val(), yearDateFormat));
                } else {
                    jQuery(elem).text(jQuery.format.date(jQuery(elem).text(), yearDateFormat));
                }
            });
        });

    });


});      