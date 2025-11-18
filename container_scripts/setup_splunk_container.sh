#!/bin/bash

cd /tmp
python3 -m venv .venv
source /tmp/.venv/bin/activate

pip install https://download.splunk.com/misc/packaging-toolkit/splunk-packaging-toolkit-1.0.1.tar.gz
