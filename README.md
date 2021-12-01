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
```

macOS:
```bash
   $ vagrant up
```

Linux:
```bash
   $ vagrant up --provider=libvirt
```
  * Note: app folder sync is ENABLED by default using NFS, if you want to disable:
```bash
   $ NFS=0 vagrant up --provider=libvirt
```

## How to access your splunk server

Open your browser and go to:  `localhost:8000`

Username: `admin`

Password: `splunk.go`

## Splunk App

Vagrant will share `app/redhat-insights` folder to vagrant box, any changes on local folder will reflect to the splunk server into vagrant box.

Splunk may have problem to show images or new changes after the changes, maybe need to restart the service:

```bash
$ sudo systemctl restart Splunkd
```

## How to create a splunk bundled app

1- Install/download Packaging CLI tool here: https://dev.splunk.com/enterprise/downloads

```bash
$ pip install https://download.splunk.com/misc/packaging-toolkit/splunk-packaging-toolkit-1.0.1.tar.gz
```
2.0- Generate the manisfest

```bash
$ slim generate-manifest app/redhat-insights
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
$ slim validate app/redhat-insights
```

3- Generate the package

```bash
$ slim package app/redhat-insights
```

4- Go to the splunk app admin page and install from File.

Note, that the images from the app are only shown after the Splunk
is restarted.


## Exposing for cluster

To expose locally running splunk (in a VM) we can use the [Ngrok](https://ngrok.com) service.

Before you start:
* Set up your HTTP Event Collector (HEC) within Splunk (see "Creating HEC" section below).
* [Sign up](https://dashboard.ngrok.com/signup)
* [download the `ngrok` binary](https://ngrok.com/download)
* and authenticate `ngrok authtoken <your_auth_token>`.

Once the Splunk is running execute:
```
ngrok http 8088
```

Your Splunk will be publically available at the displayed location.
For example: `https://abcd-999-111-22-33.ngrok.io`.


## Sending Examples

To send example events from [`examples/`](examples/) use:
```
TOKEN=puttokenhere send-examples.sh
```

The token can be found at http://localhost:8000/en-US/manager/redhat-insights/http-eventcollector.

If you haven't set up your HEC yet, you will need to do so to create the token, see "Creating HEC" section below.


## Creating HEC

Whether through the cloud login or your local instance, you will need to set up your Splunk HEC (http event collector).

For full instructions, see this official walkthrough doc from [Splunk](https://docs.splunk.com/Documentation/SplunkCloud/latest/Data/UsetheHTTPEventCollector).

Here's the "short version":

* Login. From your instance menu bar, click "Settings > Data inputs".
* Select "HTTP Event Collector" to see your existing HECs if any (for instance, our plugin should create one).
* If you still need a new one, go back and select "Add new" under "HTTP Event Collector" actions.
* Name it, click next, then add the indices you wish, usually "main".
* Next review your settings and submit.  You will be given a token here, but you can access it again at any time by navigating to "Settings > Data inputs > HTTP Event Collector" and clicking it instead of add to see all of your available HECs, their tokens, and from there enable or disable them.
* Depending on your Splunk instance, the HECs may be enabled or disabled by default.  In the cloud, they're enabled imediately when created, but in local/on-prem instances, they're disabled by default.  Go to "Global Settings" on your "HTTP Event Collector" page and ensure "All Tokens" is set to "Enabled".
