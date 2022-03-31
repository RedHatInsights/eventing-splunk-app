[![Build Candidate](https://github.com/RedHatInsights/eventing-splunk-app/actions/workflows/build_splunk_main.yml/badge.svg)](https://github.com/RedHatInsights/eventing-splunk-app/actions/workflows/build_splunk_main.yml)

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

If the above fails due to CentOS appstream no longer being available:
* run the command instead with `--no-provision`
* run `vagrant ssh`
* run the following commands:
```bash
sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-Linux-*
sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-Linux-*
```
* run `vagrant provision` to continue

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

## Set up your HEC

If you will be using our splunk plugin, it will create a HEC, http event collector, for you automatically, however if you are not using the plugin, then set up your HEC as follows.

For full instructions, see this official walkthrough doc from [Splunk](https://docs.splunk.com/Documentation/SplunkCloud/latest/Data/UsetheHTTPEventCollector).

Here's the "short version":

* Login. From your instance menu bar, click "Settings > Data inputs".
* Select "HTTP Event Collector" to see your existing HECs if any (for instance, our plugin should create one).
* If you still need a new one, go back and select "Add new" under "HTTP Event Collector" actions.
* Name it, click next, then add the indices you wish, usually "main".
* Next review your settings and submit.  You will be given a token here, but you can access it again at any time by navigating to "Settings > Data inputs > HTTP Event Collector" and clicking it instead of add to see all of your available HECs, their tokens, and from there enable or disable them.
* Depending on your Splunk instance, the HECs may be enabled or disabled by default.  In the cloud, they're enabled imediately when created, but in local/on-prem instances, they're disabled by default.  Go to "Global Settings" on your "HTTP Event Collector" page and ensure "All Tokens" is set to "Enabled", and that SSL is deselected as we will be using ngrok which handles this. See "Exposing for cluster" below to set up ngrok.

## How to create a splunk bundled app plugin

### Prerequisites:

Installed Packaging CLI tool here from https://dev.splunk.com/enterprise/downloads.

```bash
$ pip install https://download.splunk.com/misc/packaging-toolkit/splunk-packaging-toolkit-1.0.1.tar.gz
```

### Package build

1. Set new version using these commands
   ```
   version=0.1.$(date -u +%Y%m%d%H%M)
   sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"$version\"/" app/redhat-insights/app.manifest
   sed -i "s/version = .*/version = $version/" app/redhat-insights/default/app.conf
   ```
2. Validate the app:
   ```bash
   slim validate app/redhat-insights
   ```
3. Generate the package
   ```bash
   slim package app/redhat-insights
   mv "redhat-insights-$version.tar.gz" "redhat-insights-$version-$(git rev-parse --short HEAD).tar.gz"
   ```

Note, that the images from the app are only shown after the Splunk
is restarted.


## Exposing for cluster

To expose locally running splunk (in a VM) we can use the [Ngrok](https://ngrok.com) service.

Before you start:
* Set up your HTTP Event Collector (HEC) within Splunk (see "Set up your HEC" section above).
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

If you haven't set up your HEC yet, you will need to do so to create the token, see "Set up your HEC" section above.

# Setting up Notifications to send events

In order for events to be triggered, Notifications first needs to be set up with appropriate bundle, app, event type, and event subtype. Be sure you have cloned [notifications repo](https://github.com/RedHatInsights/notifications-backend). Also be sure your Splunk is running and you have already created your HEC as you will need the token.

## Using create_application_full script

Update rbac to be properly mocked for notifications' purposes.

```bash
oc edit service rbac-service
```

Edit podSelector:
```bash
selector:
  app: mocks
  name: mocks
```
and map all targetPort to 9000:
```bash
targetPort: 9000
```

You will be editing the create_application_full.py script found under notifications-backend/backend/helpers/. Make sure it has executable permission and make sure there is an rhid.txt file at the same level.

Edit the script as follows:
* under "Parameters to set", you will need to fill in each of these values to set up a unique behaviour group.
  - bundle_name is "rhel"
  - app_name is whichever app you will be sending events from such as "drift" or "advisor"
  - event_type is "camel"
* under the line 'print(">>> create camel endpoint")' you need to edit the "props"
  - set "url" equal to your splunk HEC address, which is an ngrok address if you are using ngrok to link to your vagrant splunk setup.
  - set "sub_type" to "splunk"
  - within "extras" add "token" and set it equal to your HEC token

Run the script with `python ./create_application_full.py`.  If everything creates successfully, returning 200s, you're ready to proceed.

You may now proceed to the "System Archive Upload" section below to trigger the events you have just configured.

## Alternative methods to investigate in future
If you want to deploy the behaviour group setup data directly onto ephemeral, see the [docs provided by notification](https://github.com/RedHatInsights/notifications-backend/blob/master/README.adoc).

If you are running notifications locally with a local kafka environment, you can work with the [notifications script](https://github.com/RedHatInsights/notifications-backend/blob/master/backend/helpers/send_notification.sh).

# Troubleshooting

## RBAC

The `mock` app mocks `apicast` to use it as an RBAC and for
authentication.
If the platform/proxy keeps saying that the user is not entitled,
it might be the case when the `apicast` is not patched correctly.

To resolve this, **retry the `mocks` Deployment (downscale to 0 and then to 1)**.
That would rerun patching of `apicast`.

Sometimes the RBAC is not avilable and returns 503.
If that's the case, it might be that the `podSelectors`
of `rbac` and `rbac-service` services are incorrect.

To resolve this **update/edit `podSelectors` of `rbac` and `rbac-service`
to be**:
```
app: mocks
name: mocks
```
