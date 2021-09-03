# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
    config.vm.network "forwarded_port", guest: 8000, host: 8000

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
  
    config.vm.box = "eurolinux-vagrant/centos-8" 
    config.vm.host_name = "splunk-"+Time.now.strftime("%Y%m%d%H%M%S")
  
    # config.vm.provider :libvirt do |libvirt|
    #   libvirt.memory = 2048
    #   libvirt.cpus = 2
    #   libvirt.cpu_mode = "host-passthrough"
    #   if ENV["SYSTEM_SESSION"]
    #     libvirt.qemu_use_session = false
    #   end
    # end
  
    config.vm.provision "shell", privileged: true, run: "once", inline: <<-EOS
      set -xe
      cp -rf /home/vagrant/.ssh/ /root/
      sed -i "s/^[\#\s]*PermitRootLogin.*$/PermitRootLogin yes/" /etc/ssh/sshd_config
      service sshd restart
      restorecon -R -v /root/.ssh
      echo "root:vagrant"|chpasswd
    EOS
  
    # If running `vagrant ssh` command, use 'root' user
    if ARGV.first == "ssh"
      puts "Logging in as root."
      config.ssh.username = "root"
    end
  
    config.vm.provision "setup", type: "ansible" do |ansible|
      ansible.playbook = "setup.yml"
      ansible.extra_vars = {
          pr_number: pr_number
      }
    end
  
    config.vm.provision :shell, inline: "echo Good job, now enjoy your box!"
  
  end