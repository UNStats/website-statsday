VAGRANTFILE_API_VERSION = '2'

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = 'hashicorp/precise64'
  config.vm.hostname = 'website-statsday'
  config.vm.provision 'shell', path: '_vagrant/provision.sh'
  config.vm.network 'forwarded_port', guest: 4000, host: 4000
  config.vm.network 'private_network', ip: '192.168.3.33'

  config.vm.provider 'virtualbox' do |v|
    v.customize ['modifyvm', :id, '--memory', 1024]
  end

end
