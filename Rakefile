require 'rake'

# imported tasks will be loaded once Rakefile has been processed
spec = Gem::Specification.find_by_name 'website-theme'
import "#{spec.gem_dir}/lib/tasks/build.rake"
import "#{spec.gem_dir}/lib/tasks/clone.rake"
import "#{spec.gem_dir}/lib/tasks/deploy.rake"
import "#{spec.gem_dir}/lib/tasks/validate.rake"

ENV['repo'] = 'https://github.com/UNStats/website-statsday.git' # GitHub repo
