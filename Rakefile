# encoding: utf-8
require 'rake'

# imported tasks will be loaded once Rakefile has been processed
spec = Gem::Specification.find_by_name 'website-theme'
import "#{spec.gem_dir}/lib/tasks/build.rake"
import "#{spec.gem_dir}/lib/tasks/github.rake"
import "#{spec.gem_dir}/lib/tasks/validate.rake"

ENV['GH_REPO'] = 'https://github.com/UNStats/website-statsday.git'
ENV['DEPLOY_BRANCH'] = 'gh-pages'

namespace :site do
  desc 'Deploy to environments based on branch'
  task :deploy do
    fail 'Deploy task can be executed on CI only.' unless ENV['CI'] == 'true'
    branch = ENV['TRAVIS_BRANCH']
    pull_request = (ENV['TRAVIS_PULL_REQUEST'] == 'true')
    case branch
    when 'development', 'staging' # deploy to Divshot
      ENV['JEKYLL_ENV'] = branch
      ENV['IGNORE_BASEURL'] = 'true'
    when 'master'
      if pull_request
        ENV['JEKYLL_ENV'] = 'staging' # staging build for pull requests
      else
        ENV['JEKYLL_ENV'] = 'production'
        Rake::Task['github:clone'].invoke # checkout deploy branch
      end
    else
      fail 'Branch must be one of deployment, staging or master.'
    end
    Rake::Task['site:validate'].invoke # ignore baseurl
    Rake::Task['site:build'].reenable # build task needs to run second time
    Rake::Task['site:build'].invoke # honor baseurl
    if branch == 'master' && !pull_request
      Rake::Task['github:push'].invoke # push build to deploy branch
    end
    # Deploy 'development' and 'staging' branches to Divshot via .travis.yml.
    # Pull requests will never trigger a Divshot deploy:
    # http://docs.travis-ci.com/user/deployment/divshot/
  end
end
