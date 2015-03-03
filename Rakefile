require 'jekyll'
require 'rake'

# Prod deployment requires JEKYLL_ENV = produciton on Travis CI

# Jekyll options for dev build
DEV_OPTIONS = {
  'baseurl' => '', # set 'baseurl' to '' for local preview
  'future' => true, # include posts with future date
  'lsi' => false, # suppress related posts index
  'url' => '' # set 'url' to '' for local preview
}
# Jekyll options for prod build
PROD_OPTIONS = {
  'full_rebuild' => true,
  'future' => false, # suppress posts with future date
  'lsi' => true # create index for related posts
}

# site tasks
namespace :site do
  # Preview site.
  #
  # env - environment
  #
  # Examples
  #
  #   rake site:preview - dev preview
  #   rake site:preview[prod] - prod preview
  #
  # Prod preview does not include analytics unless JEKYLL_ENV = production.
  desc 'Preview site'
  task :preview, [:env] do |_task, args|
    require 'launchy'
    # credit: https://github.com/jekyll/jekyll/blob/master/Rakefile#L141
    Thread.new do
      sleep 4
      puts 'Opening in browser...'
      Launchy.open('http://localhost:4000')
    end

    # merge dev options with serve options
    options = Jekyll::Utils.deep_merge_hashes(
      DEV_OPTIONS,
      'watch' => true,
      'serving' => true
    )
    message = 'Run dev preview...'

    if args.env == 'prod'
      # merge prod options in
      options = Jekyll::Utils.deep_merge_hashes(options, PROD_OPTIONS)
      message = 'Run prod preview...'
    end

    puts message
    Jekyll::Commands::Build.process(options)
    Jekyll::Commands::Serve.process(options)
    puts '...done.'
  end

  # Build site.
  #
  # env - environment
  #
  # Examples
  #
  #   rake site:build - dev build
  #
  #   rake site:build[prod] - prod build
  #
  # Prod build does not include analytics unless JEKYLL_ENV = production.
  desc 'Build site'
  task :build, [:env] do |_task, args|
    options = DEV_OPTIONS
    message = 'Run dev build...'
    if args.env == 'prod'
      # mixin prod options
      options = Jekyll::Utils.deep_merge_hashes(DEV_OPTIONS, PROD_OPTIONS)
      message = 'Run prod build...'
    end
    puts message
    Jekyll::Commands::Build.process(options)
    puts '...done.'
  end

  # Check links on last build.
  #
  # env - environment
  #
  # Dir to be checked depends on environemnt.
  desc 'Check links on last build'
  task :linkchecker do
    require 'html/proofer'
    puts 'Run linkchecker...'
    HTML::Proofer.new('_site').run
    puts '...done.'
  end
end

namespace :ci do
  # Prepare _site dir for build
  desc 'Checkout gh-pages branch into _site'
  task :checkout do
    fail if ENV['CI'] != 'true' # execute on CI only

    puts 'Clone repo...'
    sh 'git clone https://github.com/UNStats/website-statsday.git _site'
    puts '...done.'

    puts 'Checkout gh-pages branch...'
    Dir.chdir('_site') do
      sh 'git checkout gh-pages'
    end
    puts '...done.'

    puts 'Prepare _site for build...'
    purge_exclude = %w(
      _site/.
      _site/..
      _site/.git
      _site/.gitignore
    )
    FileList['_site/{*,.*}'].exclude(*purge_exclude).each do |path|
      sh "rm -rf #{path}"
    end
    puts '...done.'
  end

  desc 'Deploy build to GitHub Pages'
  task :deploy do
    fail if ENV['CI'] != 'true' # execute on CI only
    sha = `git rev-parse HEAD`.strip # retrieve deployment hash
    Dir.chdir('_site') do
      puts 'Add credentials to repo...'
      sh "git config user.name '#{ENV['GIT_NAME']}'"
      sh "git config user.email '#{ENV['GIT_EMAIL']}'"
      sh 'git config credential.helper "store --file=.git/credentials"'
      File.open('.git/credentials', 'w') do |f|
        f.write("https://#{ENV['GH_TOKEN']}:@github.com")
      end
      puts '...done.'

      puts 'Push changes to origin/gh-pages...'
      sh 'git add --all'
      sh "git commit --allow-empty -m 'Deploy #{sha}'"
      sh 'git push origin gh-pages'
      puts '...done.'
    end
  end
end
