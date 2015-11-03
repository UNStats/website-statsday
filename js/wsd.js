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
    $.getJSON('js/posts.json', function (data) {
        /* Fill the posts template  */
        var template = $('#posts-template').html();

        /* Fill the countries template  */
        var countries = data.codes.country;

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
        /* International organisations  */
        var o = getParameterByName('o');
        /* Other organisations  */
        var ot = getParameterByName('ot');
        /* Country  */
        var c = getParameterByName('c');
        /* Item = post  */
        var i = getParameterByName('i');
        
        /* Call function addProvider to add one or more providers to a post */
        var posts = _(data.posts).map(addHtml).map(addProvider);

        /* If international organisations */
        if (o !== '') {
            /* Get all posts by organisations */
            posts = posts.where({ 'organisations': [o] });
            /* Show div #remove-filter, a link to reset filters */
            $("#remove-filter").removeClass("make-visible");
            /* Show div #organisations displaying the organisation's name in the dropdown, mobile version only */
            $('#organisations').val(o);
            /* Show div #selected-filter displaying the organisation's name */
            $("#selected-filter h4").text(organisations.lookup(o));
        }

        /* If other organisations */
        if (ot !== '') {
            /* Get all codes for other organisations */
            var os = organisations.lookupByType(ot);
            /* Get all posts by other organisations based on the previous lookup */
            posts = posts.filter(function (p) { return _.some(_.intersection(p.organisations, os)); });
            /* Show div #remove-filter, a link to reset filters */
            $("#remove-filter").removeClass("make-visible");
            /* Show div #selected-filter diplaying "Non-governmental organisations" */
            $("#selected-filter h4").text("Non-governmental organisations");
        }

        /* If countries */
        if (c !== '') {
            /* Get all posts by countries */
            posts = posts.where({ 'countries': [c] });
            /* Show div #remove-filter, a link to reset filters */
            $("#remove-filter").removeClass("make-visible");
            /* Show div #organisations displaying the country's name in the dropdown, mobile version only */
            $('#countries').val(c);
            /* Show div #selected-filter displaying the country's name */
            $("#selected-filter h4").text(countries.lookup(c));
        }

        /* If item */
        if (i !== '') {
            /* Get the post for the corresponding post id */
            posts = posts.where({ 'id': i });
            /* Show div #remove-filter, a link to reset filters */
            $("#remove-filter").removeClass("make-visible");
        }

        /* Fill posts template  */
        var postsHtml = Mustache.to_html(template, posts.value());
        $('#posts').html(postsHtml);
    });
});