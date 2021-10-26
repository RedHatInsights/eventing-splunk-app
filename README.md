Vagrant box for Splunk
======================

What is included?

- Minimal CentOS or Oracle Linux (OL) system:
  - CentOS 8

## Before start

If you are on:

* macOS:
  - Install VirtualBox
* Linux:
  - Install KVM with libvirt library
* Install ansible on your local machine

When switching between the versions, run `rm -rf .vagrant/` first, or `vagrant destroy` twice (due to [a bug in vagrant](https://github.com/hashicorp/vagrant/issues/11800))


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

Username: `admin`

Password: `splunk.go`

## How to create a splunk bundled app

1- Install/download Packaging CLI tool here: https://dev.splunk.com/enterprise/downloads

```bash
$ pip install https://download.splunk.com/misc/packaging-toolkit/splunk-packaging-toolkit-1.0.1.tar.gz
```
2.0- Generate the manisfest

```bash
$ slim generate-manifest app/redhat-insigths
```

2.1- Change the app version on manifest on `app/app.manifest` file:

```json
    "id": {
      "group": null,
      "name": "redhat-insights",
      "version": "1.0.0"
```


Optional step:  Everytime if needed, validate the app:

```bash
$ slim validate app/redhat-insigths
```

3- Generate the package

```bash
$ slim package  pp/redhat-insigths
```

4- Go to the splunk app admin page and install from File.

Note, that the images from the app are only shown after the Splunk
is restarted.


## Exposing for cluster

To expose locally running splunk (in a VM) we can use the [Ngrok](https://ngrok.com) service.

Before you start:
* [Sign up](https://dashboard.ngrok.com/signup)
* [download the `ngrok` binary](https://ngrok.com/download)
* and authenticate `ngrok authtoken <your_auth_token>`.

Once the Splunk is running execute:
```
ngrok http 8088
```

Your Splunk will be publically available at the displayed location.
For example: `https://abcd-999-111-22-33.ngrok.io`.
