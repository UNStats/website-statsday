#!/bin/bash

# Vagrant provisioning script (executed as root)

echo "Update package repositories..."
apt-get -y update >/dev/null 2>&1
echo "...done."

echo "Install additional packages..."
apt-get -y install curl git >/dev/null 2>&1
echo "...done."

su -c "source /vagrant/_vagrant/user-config.sh" vagrant
