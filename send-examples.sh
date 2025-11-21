#!/bin/bash

SPLUNK_HEC_PORT="8088"
SPLUNK_HEC_PROTO="https"
SPLUNK="${SPLUNK:-127.0.0.1:${SPLUNK_HEC_PORT}}"
SPLUNK_ENDPOINT="${SPLUNK_HEC_PROTO}://$SPLUNK/services/collector/event"

if [[ -z "$TOKEN" ]]; then
    echo "Run with TOKEN=puttoken send-examples.sh"
    exit 1
fi

send_to_splunk() {
    local filepath="$( dirname -- "${BASH_SOURCE[0]}")/examples/$1.json"
    curl -k -u "x:$TOKEN" "${SPLUNK_ENDPOINT}" \
    -d "@$filepath" \
    -H "Content-Type: application/json"
}

# send_to_splunk advisor-new-recommendation-example
# send_to_splunk drift-baseline-detected-example
# send_to_splunk patch-example
# send_to_splunk vulnerability-example
# send_to_splunk malware-example
# send_to_splunk ros-example
send_to_splunk inventory-example
