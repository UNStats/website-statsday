require 'jekyll'
require 'rake'

# Build options:
#
# dev: "rake site:build"
# - URL overridden to '': can be served from localhost or Divshot.
# - baseurl overridden to '': localhost and Divshot serve from root dir
# - include future posts
# - does not generate related posts index
# to preview from localhost, execute "rake site:preview" instead
#
# proddev: "rake site:build[proddev]"
# - URL overridden to '': can be served from localhost or Divshot.
# - baseurl overridden to '': localhost and Divshot serve from root dir
# - do not include future posts
# - generate related posts index
# to preview from localhost, execute "rake site:preview[proddev]" instead
#
# prod: "rake site:build[prod]"
# - works only on Travis CI
# - URL and baseurl settings are respected
# - do not include future posts
# - generate related posts index
#
# Generation of Google Analytics into pages requires JEKYLL_ENV = production
# during build. This is to prevent analytics in any kind of build other than the
# one intended to be published on the production server.

# Jekyll options for dev build
DEV_OPTIONS = {
  'url' => '', # override for local preview
  'baseurl' => '', # override for local preview
  'future' => true, # include future posts
  'lsi' => false # suppress related posts index
}
# Jekyll options for prod build
PROD_OPTIONS = {
  'future' => false, # suppress future posts
  'lsi' => true, # create related posts index
  'full_rebuild' => true
}
PREVIEW_OPTIONS = {
  'watch' => true,
  'serving' => true
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
  #   rake site:preview[proddev] - proddev preview
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

    # default: dev
    options = Jekyll::Utils.deep_merge_hashes(DEV_OPTIONS, PREVIEW_OPTIONS)
    message = 'Run dev preview...'

    if args.env == 'proddev'
      # mixin PROD_OPTIONS
      options = Jekyll::Utils.deep_merge_hashes(options, PROD_OPTIONS)
      message = 'Run proddev preview...'
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
  #   rake site:build[proddev] - proddev build
  #   rake site:build[prod] - prod build
  #
  # Set JEKYLL_ENV = production to include Google Analytics.
  desc 'Build site'
  task :build, [:env] do |_task, args|
    # prod build can be execute on CI only
    fail if args.env == 'prod' && ENV['CI'] != 'true'

    # default: dev
    options = DEV_OPTIONS
    message = 'Run dev build...'

    if args.env == 'proddev'
      # mixin prod options
      options = Jekyll::Utils.deep_merge_hashes(options, PROD_OPTIONS)
      message = 'Run proddev build...'
    elsif args.env == 'prod'
      options = PROD_OPTIONS # url and baseurl may not be overridden
      message = 'Run prod build...'
    end
    puts message
    Jekyll::Commands::Build.process(options)
    puts '...done.'
  end

  # Run linkchecker on last build.
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
    )
    # _site/{*,.*} includes _site/. and _site/.. and need to be excluded
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
