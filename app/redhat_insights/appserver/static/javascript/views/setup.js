
define(['./setup_configuration'], function(Config) {

  const hecAndIndex = async (splunk_js_sdk, input) => {
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

      return await Config.create_hec_collector(service, input);
    } catch (error) {
      throw new Error('Setup failed: ' + error);
    }
  }

  const complete = async (splunk_js_sdk) => {
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

      await Config.complete_setup(service);

      await Config.reload_splunk_app(service, app_name);

      Config.redirect_to_splunk_app_homepage(app_name);

    } catch (error) {
      throw new Error('Setup failed: ' + error);
    }

  }

  const getSplunkVersion = (splunk_js_sdk) => {
    var application_name_space = {
      owner: "nobody",
      app: app_name,
      sharing: "app",
    };

    return new Promise((resolve, reject) => {
      try {
        const service = Config.create_splunk_js_sdk_service(
          splunk_js_sdk,
          application_name_space,
        );
        service.serverInfo((err, info) => {
          if (err) {
            reject(err);
          }
          else {
            const value = info.properties().version
            resolve(value);
          }
        })
      } catch (err) {
        reject(err);
      }
    })
  }

  const getAppVersion = (splunk_js_sdk) => {
    var application_name_space = {
      owner: "nobody",
      app: app_name,
      sharing: "app",
    };

    return new Promise((resolve, reject) => {
      try {
        const service = Config.create_splunk_js_sdk_service(
          splunk_js_sdk,
          application_name_space,
        );
        const apps = service.apps();
        apps.fetch((err, apps) => {
          if (err) {
            reject(err);
          }
          else {
            var app = apps.item(app_name);
            resolve(app._properties.version);
          }
        });
      } catch (err) {
        reject(err);
      }
    })
  }

  return {
    hecAndIndex, complete, getSplunkVersion, getAppVersion
  };


});
