import { promisify } from './util.js';
import * as SplunkHelpers from './splunk_helpers.js';

export const app_name = "redhat_insights";

define(["uuid"], function(uuidlib) {

  async function create_hec_collector(splunk_js_sdk_service, { hecName, defaultIndex, stanzaName }) {
    const token = uuidlib.v4();
    const properties_to_update = {
      disabled: 0,
      host: "splunk",
      index: defaultIndex || "redhatinsights",
      token: token
    };

    await SplunkHelpers.create_hec_collector(
      splunk_js_sdk_service,
      stanzaName,
      properties_to_update
    );

    return token;
  }

  async function complete_setup(splunk_js_sdk_service) {
    var configuration_file_name = "app";
    var stanza_name = "install";

    var properties_to_update = {
      is_configured: "true",
    };

    await SplunkHelpers.update_configuration_file(
      splunk_js_sdk_service,
      configuration_file_name,
      stanza_name,
      properties_to_update,
    );
  };

  async function reload_splunk_app(
    splunk_js_sdk_service,
    app_name,
  ) {
    var splunk_js_sdk_apps = splunk_js_sdk_service.apps();
    await promisify(splunk_js_sdk_apps.fetch)();

    var current_app = splunk_js_sdk_apps.item(app_name);
    await promisify(current_app.reload)();
  };

  function redirect_to_splunk_app_homepage(
    app_name,
  ) {
    var redirect_url = "/app/" + app_name;

    window.location.href = redirect_url;
  };


  function create_splunk_js_sdk_service(
    splunk_js_sdk,
    application_name_space,
  ) {
    var http = new splunk_js_sdk.SplunkWebHttp();

    var splunk_js_sdk_service = new splunk_js_sdk.Service(
      http,
      application_name_space,
    );

    return splunk_js_sdk_service;
  };

  return {
    complete_setup,
    reload_splunk_app,
    redirect_to_splunk_app_homepage,
    create_splunk_js_sdk_service,
    create_hec_collector,
  };

});
