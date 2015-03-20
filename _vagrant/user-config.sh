#!/bin/bash

# User config script (executed as user vagrant)

echo "Install RVM..."
# gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3
command curl -sSL https://rvm.io/mpapis.asc | gpg --import - # hkp does not pass through firewall
\curl -sSL https://get.rvm.io | bash -s stable
source /home/vagrant/.rvm/scripts/rvm
echo "...done."

echo "Install NVM..."
curl https://raw.githubusercontent.com/creationix/nvm/v0.24.0/install.sh | bash
echo "source /home/vagrant/.nvm/nvm.sh" >> /home/vagrant/.bash_profile
source /home/vagrant/.nvm/nvm.sh
echo "...done."

# cd to /vagrant when logging in via "vagrant ssh"
echo "cd /vagrant" >> /home/vagrant/.bash_profile

# cd into /vagrant to get access to NVM and RVM config files
cd /vagrant

echo "Install Ruby..."
rvm install "$(cat .ruby-version)"
echo "...done."

echo "Install Node..."
NODE_VERSION="$(cat .nvmrc)"
nvm install $NODE_VERSION
nvm alias default $NODE_VERSION
echo "...done."

# switch to gemset configured in .ruby-gemset
cd ..
cd /vagrant

# install dependencies
bundle
