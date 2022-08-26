#!/bin/bash

SPLUNK="${SPLUNK:-localhost:8088}"

if [[ -z "$TOKEN" ]]; then
    echo "Run with TOKEN=puttoken send-examples.sh"
    exit 1
fi

send_to_spulnk() {
    local filepath="$( dirname -- "${BASH_SOURCE[0]}")/examples/$1.json"
    curl -u "x:$TOKEN" "http://$SPLUNK/services/collector/event" \
    -d "@$filepath" \
    -H "Content-Type: application/json"
}

send_to_spulnk advisor-new-recommendation-example
send_to_spulnk drift-baseline-detected-example
send_to_spulnk patch-example
send_to_spulnk vulnerability-example
