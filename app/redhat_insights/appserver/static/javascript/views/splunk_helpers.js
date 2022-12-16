import { promisify } from "./util.js";

async function get_config_value(
  splunk_js_sdk_service,
  configuration_file_name,
  stanza_name
) {
  console.debug("Called get_config_value");

  // Retrieve the accessor used to get a configuration file
  var splunk_js_sdk_service_configurations =
    splunk_js_sdk_service.configurations({
      // Name space information not provided
    });
  splunk_js_sdk_service_configurations = await promisify(
    splunk_js_sdk_service_configurations.fetch
  )();
  console.debug("splunk_js_sdk_service_configurations", splunk_js_sdk_service_configurations);

  // Check for the existence of the configuration file
  var configuration_file_exist = does_configuration_file_exist(
    splunk_js_sdk_service_configurations,
    configuration_file_name
  );

  // Retrieves the configuration file accessor
  var configuration_file_accessor = get_configuration_file(
    splunk_js_sdk_service_configurations,
    configuration_file_name
  );
  configuration_file_accessor = await promisify(
    configuration_file_accessor.fetch
  )();

  // Checks to see if the stanza where the inputs will be
  // stored exist
  var stanza_exist = does_stanza_exist(
    configuration_file_accessor,
    stanza_name
  );

  // If the configuration stanza doesn't exist, create it
  if (!stanza_exist) {
    await create_stanza(configuration_file_accessor, stanza_name);
  }
  // Need to update the information after the creation of the stanza
  configuration_file_accessor = await promisify(
    configuration_file_accessor.fetch
  )();

  // Retrieves the configuration stanza accessor
  var configuration_stanza_accessor = get_configuration_file_stanza(
    configuration_file_accessor,
    stanza_name
  );
  configuration_stanza_accessor = await promisify(
    configuration_stanza_accessor.fetch
  )();

  return does_setup_is_configured(configuration_stanza_accessor)
}


async function create_hec_collector(
  splunk_js_sdk_service,
  stanza_name,
  properties_to_update
) {
  const configuration_file_name = 'inputs';

  // Retrieve the accessor used to get a configuration file
  var splunk_js_sdk_service_configurations =
    splunk_js_sdk_service.configurations({
      // Name space information not provided
    });
  splunk_js_sdk_service_configurations = await promisify(
    splunk_js_sdk_service_configurations.fetch
  )();

  // Check for the existence of the configuration file
  var configuration_file_exist = does_configuration_file_exist(
    splunk_js_sdk_service_configurations,
    configuration_file_name
  );

  // If the configuration file doesn't exist, create it
  if (!configuration_file_exist) {
    await create_configuration_file(
      splunk_js_sdk_service_configurations,
      configuration_file_name
    );

    // BUG WORKAROUND: re-fetch because the client doesn't do so
    splunk_js_sdk_service_configurations = await promisify(
      splunk_js_sdk_service_configurations.fetch
    )();
  }

  // Retrieves the configuration file accessor
  var configuration_file_accessor = get_configuration_file(
    splunk_js_sdk_service_configurations,
    configuration_file_name
  );

  configuration_file_accessor = await promisify(
    configuration_file_accessor.fetch
  )();

  var stanza_exist = does_stanza_exist(
    configuration_file_accessor,
    stanza_name
  );

  if (!stanza_exist) {
    await create_stanza(configuration_file_accessor, stanza_name);
  }

  configuration_file_accessor = await promisify(
    configuration_file_accessor.fetch
  )();

  var configuration_stanza_accessor = get_configuration_file_stanza(
    configuration_file_accessor,
    stanza_name
  );
  configuration_stanza_accessor = await promisify(
    configuration_stanza_accessor.fetch
  )();

  // We don't care if the stanza property does or doesn't exist
  // This is because we can use the
  // configurationStanza.update() function to create and
  // change the information of a property
  await update_stanza_properties(
    configuration_stanza_accessor,
    properties_to_update
  );
}
// ----------------------------------
// Splunk JS SDK Helpers
// ----------------------------------
// ---------------------
// Process Helpers
// ---------------------
async function update_configuration_file(
  splunk_js_sdk_service,
  configuration_file_name,
  stanza_name,
  properties
) {
  // Retrieve the accessor used to get a configuration file
  var splunk_js_sdk_service_configurations =
    splunk_js_sdk_service.configurations({
      // Name space information not provided
    });
  splunk_js_sdk_service_configurations = await promisify(
    splunk_js_sdk_service_configurations.fetch
  )();

  // Check for the existence of the configuration file
  var configuration_file_exist = does_configuration_file_exist(
    splunk_js_sdk_service_configurations,
    configuration_file_name
  );

  // If the configuration file doesn't exist, create it
  if (!configuration_file_exist) {
    await create_configuration_file(
      splunk_js_sdk_service_configurations,
      configuration_file_name
    );

    // BUG WORKAROUND: re-fetch because the client doesn't do so
    splunk_js_sdk_service_configurations = await promisify(
      splunk_js_sdk_service_configurations.fetch
    )();
  }

  // Retrieves the configuration file accessor
  var configuration_file_accessor = get_configuration_file(
    splunk_js_sdk_service_configurations,
    configuration_file_name
  );
  configuration_file_accessor = await promisify(
    configuration_file_accessor.fetch
  )();

  // Checks to see if the stanza where the inputs will be
  // stored exist
  var stanza_exist = does_stanza_exist(
    configuration_file_accessor,
    stanza_name
  );

  // If the configuration stanza doesn't exist, create it
  if (!stanza_exist) {
    await create_stanza(configuration_file_accessor, stanza_name);
  }
  // Need to update the information after the creation of the stanza
  configuration_file_accessor = await promisify(
    configuration_file_accessor.fetch
  )();

  // Retrieves the configuration stanza accessor
  var configuration_stanza_accessor = get_configuration_file_stanza(
    configuration_file_accessor,
    stanza_name
  );
  configuration_stanza_accessor = await promisify(
    configuration_stanza_accessor.fetch
  )();

  // We don't care if the stanza property does or doesn't exist
  // This is because we can use the
  // configurationStanza.update() function to create and
  // change the information of a property
  await update_stanza_properties(configuration_stanza_accessor, properties);
}

function create_configuration_file(
  configurations_accessor,
  configuration_file_name
) {
  return promisify(configurations_accessor.create)(configuration_file_name);
}

// ---------------------
// Existence Functions
// ---------------------
function does_configuration_file_exist(
  configurations_accessor,
  configuration_file_name
) {
  var was_configuration_file_found = false;

  var configuration_files_found = configurations_accessor.list();
  for (var index = 0; index < configuration_files_found.length; index++) {
    var configuration_file_name_found = configuration_files_found[index].name;
    if (configuration_file_name_found === configuration_file_name) {
      was_configuration_file_found = true;
      break;
    }
  }

  return was_configuration_file_found;
}

function does_stanza_exist(configuration_file_accessor, stanza_name) {
  var was_stanza_found = false;

  var stanzas_found = configuration_file_accessor.list();
  for (var index = 0; index < stanzas_found.length; index++) {
    var stanza_found = stanzas_found[index].name;
    if (stanza_found === stanza_name) {
      was_stanza_found = true;
      break;
    }
  }

  return was_stanza_found;
}

function does_stanza_property_exist(
  configuration_stanza_accessor,
  property_name
) {
  var was_property_found = false;

  for (const [key, value] of Object.entries(
    configuration_stanza_accessor.properties()
  )) {
    if (key === property_name) {
      was_property_found = true;
      break;
    }
  }

  return was_property_found;
}

function does_setup_is_configured(
  configuration_stanza_accessor
) {
  const properties = configuration_stanza_accessor.properties()

  if (properties.is_configured == 1){
    return true
  } else{
    return false
  }
}

// ---------------------
// Retrieval Functions
// ---------------------
function get_configuration_file(
  configurations_accessor,
  configuration_file_name
) {
  var configuration_file_accessor = configurations_accessor.item(
    configuration_file_name,
    {
      // Name space information not provided
    }
  );

  return configuration_file_accessor;
}

function get_configuration_file_stanza(
  configuration_file_accessor,
  configuration_stanza_name
) {
  var configuration_stanza_accessor = configuration_file_accessor.item(
    configuration_stanza_name,
    {
      // Name space information not provided
    }
  );

  return configuration_stanza_accessor;
}

function get_configuration_file_stanza_property(
  configuration_file_accessor,
  configuration_file_name
) {
  return null;
}

function create_stanza(configuration_file_accessor, new_stanza_name) {
  return promisify(configuration_file_accessor.create)(new_stanza_name);
}

function update_stanza_properties(
  configuration_stanza_accessor,
  new_stanza_properties
) {
  return promisify(configuration_stanza_accessor.update)(new_stanza_properties);
}

export { get_config_value, update_configuration_file, create_hec_collector };
