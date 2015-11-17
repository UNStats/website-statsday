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
        /* Fill the posts template  */
        var template = $('#events-template').html();

        /* Fill the countries template  */
        var countries = data.locations;

        /* If countries, get the country names associated with the codes  */
        if (countries) {
            countries.lookup = function (code) {
                return _(this).where({ 'code': code }).pluck('name').first();
            };
        }

        /* Fill the organisations template  */
        var organisations = data.codes.organisation;

        /* If organisations, get the organisation names or organisation type associated with the codes  */
        if (organisations) {
            /* Lookup by code */
            organisations.lookup = function (code) {
                return _(this).where({ 'code': code }).pluck('name').first();
            };
            /* Lookup by type (international/other) */
            organisations.lookupByType = function (type) {
                return _(this).where({ 'type': type }).pluck('code').value();
            }
        }

        /* Take a post, add the provider/s and return the completed post  */
        var addProvider = function (post) {
            post.provider = function () {
                var cs = _(this.countries || []).map(function (code) { return countries.lookup(code); });
                var os = _(this.organisations || []).map(function (code) { return organisations.lookup(code); }).value();
                return cs.concat(os).reduce(function (s, value) { return s += ', ' + value; });
            };
            return post;
        }

        /* Convert the markdown into HTML using the Lodash library */
        var addHtml = function (post) {
            post.html = function () {
                return markdown.toHTML(this.text);
            };
            return post;
        };

        /* Call function getParameterByName to get the query strings and assign them to a variable [array] */
        /* City  */
        var c = getParameterByName('c');
        
        /* Call function addProvider to add one or more providers to a post */
        //var events = _(data.events).map(addHtml).map(addProvider);
        var events = _(data.events).map(addHtml);

        /* If countries */
        if (c !== '') {
            /* Get all posts by countries */
            events = events.where({ 'city': [c] });
        }

        /* Fill events template  */
        var eventsHtml = Mustache.to_html(template, events.value());
        $('#events').html(eventsHtml);
    });
});