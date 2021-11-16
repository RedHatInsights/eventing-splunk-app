# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  module OS
    def self.mac?
        (/darwin/ =~ RUBY_PLATFORM) != nil
    end
  end

  config.vm.network "forwarded_port", guest: 8000, host: 8000
  config.vm.network "forwarded_port", guest: 8088, host: 8088

  # Disable default sync
  config.vm.synced_folder ".", "/vagrant", disabled: true
  

  pr_number = ENV["PR"]

  rsync = ENV["RSYNC"] || "0"
  unless %w{ 0 1 }.include? rsync
    abort "ERROR: The allowed values for RSYNC environment var are: 1 and 0 (default)"
  end

  nfs = ENV["NFS"] || "0"
  unless %w{ 0 1 }.include? nfs
    abort "ERROR: The allowed values for NFS environment var are: 1 and 0 (default)"
  end
  
  if ENV.fetch('NFS', '1')  == "1"
    config.vm.synced_folder "./app/redhat-insights", "/opt/splunk/etc/apps/redhat-insights", create: true, type: "nfs", nfs_udp: false
  elsif OS.mac?
    config.vm.synced_folder "./app/redhat-insights", "/opt/splunk/etc/apps/redhat-insights", create: true
  end

  config.vm.box = "eurolinux-vagrant/centos-8"
  config.vm.host_name = "splunk-"+Time.now.strftime("%Y%m%d%H%M%S")

  config.vm.provider :libvirt do |libvirt|
    libvirt.memory = 2048
    libvirt.cpus = 2
    libvirt.cpu_mode = "host-passthrough"
    if ENV["SYSTEM_SESSION"]
      libvirt.qemu_use_session = false
    end
  end
  
  config.vm.provider "virtualbox" do |v|
    v.check_guest_additions = false
    v.memory = 2048
    v.cpus = 2
  end

  config.vm.provision "setup", type: "ansible" do |ansible|
    ansible.playbook = "setup.yml"
    ansible.extra_vars = {
      pr_number: pr_number
    }
  end

  config.vm.provision :shell, inline: "echo Good job, now enjoy your box!"

end
