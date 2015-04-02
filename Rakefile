require 'rake'

# imported tasks will be loaded once Rakefile has been processed
spec = Gem::Specification.find_by_name 'website-theme'
import "#{spec.gem_dir}/lib/tasks/build.rake"
import "#{spec.gem_dir}/lib/tasks/ghpages.rake"
import "#{spec.gem_dir}/lib/tasks/validate.rake"

ENV['GH_REPO'] = 'https://github.com/UNStats/website-statsday.git' # GitHub repo

namespace :site do
  desc 'Deploy task based on branch'
  task :deploy do
    fail unless ENV['CI'] == 'true' # execute on CI only
    if ENV['TRAVIS_BRANCH'] == 'development'
      ENV['JEKYLL_ENV'] = 'development'
    elsif ENV['TRAVIS_BRANCH'] == 'staging'
      ENV['JEKYLL_ENV'] = 'staging'
    elsif ENV['TRAVIS_BRANCH'] == 'master'
      ENV['JEKYLL_ENV'] = 'production'
      Rake::Task['ghpages:clone'].invoke # checkout gh-pages branch
    else
      fail
    end
    Rake::Task['site:build'].invoke
    Rake::Task['site:validate'].invoke # site has no baseurl
    if ENV['TRAVIS_BRANCH'] == 'master'
      Rake::Task['ghpages:push'].invoke # push build to gh-pages branch
    end
    # deploy development and staging branches to Divshot, see .travis.yml
  end
end
