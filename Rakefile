require 'jekyll'
require 'launchy'
require 'rake'

# Site tasks
namespace :test do
  desc 'Generate and view the site locally'
  task :preview do
    # borrowed from https://github.com/jekyll/jekyll/blob/master/Rakefile#L141
    Thread.new do
      sleep 4
      puts 'Opening in browser...'
      Launchy.open('http://localhost:4000')
    end

    options = {
      'watch'   => true,
      'serving' => true
    }

    Jekyll::Commands::Build.process(options)
    Jekyll::Commands::Serve.process(options)
  end

  desc 'Build website locally'
  task :build do
    Jekyll::Commands::Build.process({})
  end
end
