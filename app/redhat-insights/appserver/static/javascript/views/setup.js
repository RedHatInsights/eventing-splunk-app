"use strict";

import * as Config from './setup_configuration.js'

export const perform = async (splunk_js_sdk, input) => {
  var application_name_space = {
    owner: "nobody",
    app: app_name,
    sharing: "app",
  };

  try {
    const service = Config.create_splunk_js_sdk_service(
      splunk_js_sdk,
      application_name_space,
    );

    await Config.create_hec_collector(service)

    await Config.complete_setup(service);
    
    await Config.reload_splunk_app(service, app_name);

    Config.redirect_to_splunk_app_homepage(app_name);
  } catch (error) {
    throw new Error('Setup failed: ' + error);
  }
}
