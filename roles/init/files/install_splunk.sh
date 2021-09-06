#!/bin/sh
setenforce 0
sed -i s/SELINUX=enforcing/SELINUX=disabled/g /etc/selinux/config
hostnamectl set-hostname splunk
sudo yum -y install wget mlocate

sudo useradd splunk -G wheel -m -d /opt/splunk -s /bin/bash
echo -e "splunk1\nsplunk1" | sudo passwd splunk

sudo mkdir /opt/splunk /opt/installers
sudo chown -R splunk:splunk /opt/splunk /opt/installers
cd /opt/installers

#Splunk Enterprise
wget -O splunk-8.0.1-6db836e2fb9e-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=8.0.1&product=splunk&filename=splunk-8.0.1-6db836e2fb9e-linux-2.6-x86_64.rpm&wget=true'
#wget -O splunk-8.0.0-1357bef0a7f6-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=8.0.0&product=splunk&filename=splunk-8.0.0-1357bef0a7f6-linux-2.6-x86_64.rpm&wget=true'
#wget -O splunk-7.2.4.2-fb30470262e3-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=7.2.4.2&product=splunk&filename=splunk-7.2.4.2-fb30470262e3-linux-2.6-x86_64.rpm&wget=true'
#wget -O splunk-7.2.1-be11b2c46e23-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=7.2.1&product=splunk&filename=splunk-7.2.1-be11b2c46e23-linux-2.6-x86_64.rpm&wget=true'
#wget -O splunk-7.1.3-51d9cac7b837-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=7.1.3&product=splunk&filename=splunk-7.1.3-51d9cac7b837-linux-2.6-x86_64.rpm&wget=true'
#wget -O splunk-7.1.0-2e75b3406c5b-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=7.1.0&product=splunk&filename=splunk-7.1.0-2e75b3406c5b-linux-2.6-x86_64.rpm&wget=true'
#wget -O splunk-7.0.1-2b5b15c4ee89-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=7.0.1&product=splunk&filename=splunk-7.0.1-2b5b15c4ee89-linux-2.6-x86_64.rpm&wget=true'
#wget -O splunk-7.0.0-c8a78efdd40f-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=7.0.0&product=splunk&filename=splunk-7.0.0-c8a78efdd40f-linux-2.6-x86_64.rpm&wget=true'
#wget -O splunk-6.6.3-e21ee54bc796-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=6.6.3&product=splunk&filename=splunk-6.6.3-e21ee54bc796-linux-2.6-x86_64.rpm&wget=true'

#Universal Forwarder
wget -O splunkforwarder-8.0.1-6db836e2fb9e-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=8.0.1&product=universalforwarder&filename=splunkforwarder-8.0.1-6db836e2fb9e-linux-2.6-x86_64.rpm&wget=true'
#wget -O splunkforwarder-8.0.0-1357bef0a7f6-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=8.0.0&product=universalforwarder&filename=splunkforwarder-8.0.0-1357bef0a7f6-linux-2.6-x86_64.rpm&wget=true'
#wget -O splunkforwarder-7.2.4-8a94541dcfac-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=7.2.4&product=universalforwarder&filename=splunkforwarder-7.2.4-8a94541dcfac-linux-2.6-x86_64.rpm&wget=true'
#wget -O splunkforwarder-7.2.1-be11b2c46e23-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=7.2.1&product=universalforwarder&filename=splunkforwarder-7.2.1-be11b2c46e23-linux-2.6-x86_64.rpm&wget=true'
#wget -O splunkforwarder-7.1.3-51d9cac7b837-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=7.1.3&product=universalforwarder&filename=splunkforwarder-7.1.3-51d9cac7b837-linux-2.6-x86_64.rpm&wget=true'
#wget -O splunkforwarder-7.1.0-2e75b3406c5b-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=7.1.0&product=universalforwarder&filename=splunkforwarder-7.1.0-2e75b3406c5b-linux-2.6-x86_64.rpm&wget=true'
#wget -Owget -O splunkforwarder-7.1.0-2e75b3406c5b-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=7.1.0&product=universalforwarder&filename=splunkforwarder-7.1.0-2e75b3406c5b-linux-2.6-x86_64.rpm&wget=true' splunkforwarder-7.0.1-2b5b15c4ee89-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=7.0.1&product=universalforwarder&filename=splunkforwarder-7.0.1-2b5b15c4ee89-linux-2.6-x86_64.rpm&wget=true'
#wget -O splunkforwarder-7.0.0-c8a78efdd40f-linux-2.6-x86_64.rpm 'https://www.splunk.com/bin/splunk/DownloadActivityServlet?architecture=x86_64&platform=linux&version=7.0.0&product=universalforwarder&filename=splunkforwarder-7.0.0-c8a78efdd40f-linux-2.6-x86_64.rpm&wget=true'

#Install software
sudo rpm -i splunk-8.0*-linux-2.6-x86_64.rpm

sudo chown -R splunk:splunk /opt/splunk
sudo /opt/splunk/bin/splunk start --answer-yes --no-prompt --accept-license --seed-passwd splunk.go

# commenting because we are local vm, in real machine we need it
# yum -y install firewalld
# systemctl start firewalld.service
# firewall-cmd --zone=public --permanent --add-service=https
# firewall-cmd --zone=public --permanent --add-port=8000/tcp
# firewall-cmd --zone=public --permanent --add-port=8089/tcp
# firewall-cmd --zone=public --permanent --add-port=9997/tcp
# firewall-cmd --reload

setenforce 1