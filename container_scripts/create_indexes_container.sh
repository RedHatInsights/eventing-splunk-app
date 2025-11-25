#!/bin/bash

INDEX_NAME="redhatinsights"

/opt/splunk/bin/splunk add index ${INDEX_NAME}
/opt/splunk/bin/splunk http-event-collector create redhatinsights  -index ${INDEX_NAME} -description 'DEV Red Hat Insights token' -uri https://127.0.0.1:8089
