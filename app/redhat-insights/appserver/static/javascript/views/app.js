import * as Setup from "./setup.js";

define(["react", "splunkjs/splunk"], function(react, splunk_js_sdk){
  const e = react.createElement;

  const SetupPage = () =>  {
    const [status, setStatus] = react.useState('');
    const [inProgress, setInProgress] = react.useState(false);
    const [username, setUsername] = react.useState();
    const [password, setPassword] = react.useState();
    const [cluster, setCluster] = react.useState("console.redhat.com");

    const handleChangeFor = (setter) => (event) => {
      setter(event.target.value);
    };

    const handleSubmit = async (event) => {
      event.preventDefault();

      setStatus('Setting up...');
      setInProgress(true);

      try {
        await Setup.perform(splunk_js_sdk, { password })
      } catch (error) {
        setInProgress(false);
        setStatus(error.message);
        return;
      }

      setStatus('Setup done! Redirecting...');
    }

    return e("div", { class: 'setup_container' }, [
      e("h2", null, "Set up the integration with Red Hat"),
      e("div", null, [
        e("form", { onSubmit: handleSubmit }, [
          e('fieldset', null, [
            e('div', { class: 'form form-horizontal' }, [
              e('div', { class: 'control-group shared-controls-controlgroup control-group-default' }, [
                e('label', { class: 'control-label' }, ['Username']),
                e('div', { class: 'controls controls-join' }, [
                  e('div', { class: 'control shared-controls-textcontrol control-default' }, [
                    e("input", { type: "text", name: "username", value: username, onChange: handleChangeFor(setUsername) })
                  ])
                ])
              ]),
              e('div', { class: 'control-group shared-controls-controlgroup control-group-default' }, [
                e('label', { class: 'control-label' }, ['Password']),
                e('div', { class: 'controls controls-join' }, [
                  e('div', { class: 'control shared-controls-textcontrol control-default' }, [
                    e("input", { type: "password", name: "password", value: password, onChange: handleChangeFor(setPassword) })
                  ])
                ])
              ]),
              e('div', { class: 'control-group shared-controls-controlgroup control-group-default' }, [
                e('label', { class: 'control-label' }, ['Console']),
                e('div', { class: 'controls controls-join' }, [
                  e('div', { class: 'control shared-controls-textcontrol control-default' }, [
                    e("input", { type: "text", name: "cluster", value: cluster, onChange: handleChangeFor(setCluster) })
                  ])
                ])
              ]),
              e('div', { class: 'control-group shared-controls-controlgroup control-group-default' }, [
                e('label', { class: 'control-label' }),
                e('div', { class: 'controls controls-join' }, [
                  e("input", { type: "submit", value: "Log in & setup", class: 'btn btn-primary', disabled: inProgress }),
                  e('div', { class: 'inline-status' }, [status])
                ])
              ]),
            ])
          ]),
        ])
      ])
    ]);
  };

  return e(SetupPage);
});
