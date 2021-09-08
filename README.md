Vagrant box for splunk
============================

What is included?

- Minimal CentOS or Oracle Linux (OL) system:
  - CentOS 8
  - When switching between the versions, run `rm -rf .vagrant/` first, or `vagrant destroy` twice (due to [a bug in vagrant](https://github.com/hashicorp/vagrant/issues/11800))

## Before start

If you are on:

* macOS:
  
  - Install VirtualBox

* Linux:
  
  - Install KVM with libvirt library


* Install ansible on your local machine
  
## Getting Started

To get the default development environment (CentOS 8):

```bash
$ git clone https://github.com/RedHatInsights/eventing.git
$ cd eventing/splunk

macOS: 
   $ vagrant up
Linux:
   $ vagrant up --provider=libvirt
```

## How to access your splunk server

Open your browser and go to:  `localhost:8000`

Username: `splunk`

Password: `splunk`

