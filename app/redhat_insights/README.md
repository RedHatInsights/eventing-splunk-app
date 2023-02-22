# Red Hat Insights application for Splunk

### Description

Red Hat Insights is a managed service that continuously gathers and analyzes platform and application data to predict risk, recommend actions, and track costs. Insights alerts administrators with timely warnings and/or suggested optimizations for the systems in your implementation, for example:

- Operations - an outage is about to occur
- Security - a new CVE is affecting your systems
- Business - overspending on resources is taking place

The application integration with Splunk either uses Insights APIs to collect data and perform tasks in a similar way to a client that you would create yourself, or subscribes to streams of Insights events. The method you use depends on your targeted use case.

Red Hat Insights application for Splunk forwards selected Insights events to Splunk. The application seamlessly integrates with Red Hat Insights, so that you can focus on handling the data on the Splunk application side, in the same way you manage other sources of data.

Insights is included as part of your Red Hat subscription, and is accessible through [Red Hat Hybrid Cloud Console](https://console.redhat.com).

Installation and initial configuration are automated, so setting up the integration is quick and simple. The project is open source, and we welcome contributions or feedback on its repository.

### Pre-requisites

- Create a new index on your Splunk server named as `redhatinsights` and make it enabled.

### Documentation

- **Installation and Release Notes:** See the application Splunkbase page.
- **Red Hat documentation:** See [Configuring notifications and integrations on the Red Hat Hybrid Cloud Console](https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/configuring_notifications_and_integrations_on_the_red_hat_hybrid_cloud_console/index).
- **Support:** For questions about this beta release, email <SplunkBeta@redhat.com>.

### Support

If you have any issues with the Red Hat Insights application for Splunk, contact Red Hat for support at <https://access.redhat.com>. Splunk will not provide warm transfers or basic troubleshooting. The Red Hat Insights application for Splunk is fully supported by Red Hat.

Copyright (C) 2022 Red Hat, Inc. All Rights Reserved.
