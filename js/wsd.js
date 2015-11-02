    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
      }

      $(function() {
        $.getJSON('js/posts.json', function(data) {
          var template = $('#posts-template').html();

          var countries = data.codes.country;

          if (countries) {
            countries.lookup = function (code) {
              return _(this).where({ 'code': code }).pluck('name').first();
            };
          }

          var organisations = data.codes.organisation;

          if (organisations) {
            organisations.lookup = function (code) {
              return _(this).where({ 'code': code }).pluck('name').first();
            };

            organisations.lookupByType = function (type) {
              return _(this).where({ 'type': type }).pluck('code').value();
            }
          }

          var addProvider = function(post) {
            post.provider = function() {
              var cs = _(this.countries || []).map(function (code) { return countries.lookup(code); });
              var os = _(this.organisations || []).map(function (code) { return organisations.lookup(code); }).value();
              return cs.concat(os).reduce(function (s, value) { return s += ', ' + value; });
            };
            return post;
          }

          var addHtml = function(post) {
            post.html = function() {
              return markdown.toHTML(this.text);
            };
            return post;
          };

          var o = getParameterByName('o');
          var ot = getParameterByName('ot');
          var c = getParameterByName('c');
          var i = getParameterByName('i');
          var posts = _(data.posts).map(addHtml).map(addProvider);

          if (o !== '') {
            posts = posts.where({'organisations': [o]});
            $("#remove-filter").removeClass("make-visible");
            $('#organisations').val(o);
            $("#selected-filter h4").text(organisations.lookup(o));
          }

          if (ot !== '') {
            var os = organisations.lookupByType(ot);
            posts = posts.filter(function(p) { return _.some(_.intersection(p.organisations, os)); });
            $("#remove-filter").removeClass("make-visible");
            $("#selected-filter h4").text("Non-governmental organisations");
          }

          if (c !== '') {
            posts = posts.where({'countries': [c]});
            $("#remove-filter").removeClass("make-visible");
            $('#countries').val(c);
            $("#selected-filter h4").text(countries.lookup(c));
          }

          if (i !== '') {
            posts = posts.where({'id': i});
            $("#remove-filter").removeClass("make-visible");
          }

          var postsHtml = Mustache.to_html(template, posts.value());
          $('#posts').html(postsHtml);
        });
      });