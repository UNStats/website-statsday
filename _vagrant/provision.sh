#!/bin/bash

# Vagrant provisioning script (executed as root)

# install git
apt-get -y update
apt-get -y install curl git

su -c "source /vagrant/_vagrant/user-config.sh" vagrant
