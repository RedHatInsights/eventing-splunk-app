#!/bin/bash
WORK="/opt/work"

if ( `pip show splunk-packaging-toolkit > /dev/null 2>&1` ); then
  echo "INFO: splunk-packaging-toolkit already installed"
else
  pip install splunk-packaging-toolkit
fi

cd $WORK

version=0.1.$(date -u +%Y%m%d%H%M)
sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"$version\"/" app/redhat_insights/app.manifest
sed -i "s/version = .*/version = $version/" app/redhat_insights/default/app.conf

slim validate app/redhat_insights
slim package app/redhat_insights

BRANCH_NAME=$(cat .git/HEAD | cut -d' ' -f2-)
if [ $(echo $BRANCH_NAME | grep 'refs/heads') ];then
  # branch checked out
  GIT_REV=`cut -c 1-7 .git/$BRANCH_NAME`
else
  # commit checked out
  GIT_REV=`echo ${BRANCH_NAME} | cut -c 1-7`
fi

if [ ! -f "redhat_insights-${version}.tar.gz" ]; then
    echo "Error: Source file redhat_insights-${version}.tar.gz does not exist."
    exit 1
fi

mv "redhat_insights-${version}.tar.gz" "redhat_insights-${version}-${GIT_REV}.tar.gz"
/opt/splunk/bin/splunk install app "./redhat_insights-${version}-${GIT_REV}.tar.gz"
