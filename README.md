Vagrant box for splunk
============================

What is included?

- Minimal CentOS or Oracle Linux (OL) system:
  - CentOS 8
  - To choose the system version, run `SYSTEM=X vagrant up`, where X is one of (ol6, ol7, ol8, centos6, centos7, centos8, centos8stream)
  - When switching between the versions, run `rm -rf .vagrant/` first, or `vagrant destroy` twice (due to [a bug in vagrant](https://github.com/hashicorp/vagrant/issues/11800))

## Getting Started

To get the default development environment (CentOS 8):

```bash
git clone https://github.com/RedHatInsights/eventing.git
cd eventing/splunk
vagrant up
vagrant ssh
```

Install ansible on your machine
