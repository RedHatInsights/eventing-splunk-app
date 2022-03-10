import * as Setup from "./setup.js";

define(["react", "splunkjs/splunk"], function(react, splunk_js_sdk){
  const e = react.createElement;

  const SetupPage = () =>  {
    const hecName = 'redhatinsights';
    const defaultIndex = 'redhatinsights';
    const [status, setStatus] = react.useState('');
    const [inProgress, setInProgress] = react.useState(false);

    const handleSubmit = async (event) => {
      event.preventDefault();

      setStatus('Setting up...');
      setInProgress(true);

      try {
        await Setup.perform(splunk_js_sdk, { hecName, defaultIndex });
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
                e('label', { class: 'control-label' }, ['HEC name']),
                e('div', { class: 'controls controls-join' }, [
                  e('div', { class: 'control shared-controls-textcontrol control-default' }, [
                    e("input", { disabled: true, type: "text", name: "hecName", value: hecName })
                  ])
                ])
              ]),
              e('div', { class: 'control-group shared-controls-controlgroup control-group-default' }, [
                e('label', { class: 'control-label' }, ['Default index']),
                e('div', { class: 'controls controls-join' }, [
                  e('div', { class: 'control shared-controls-textcontrol control-default' }, [
                    e("input", { disabled: true, type: "text", name: "defaultIndex", value: defaultIndex })
                  ])
                ])
              ]),
              e('div', { class: 'control-group shared-controls-controlgroup control-group-default' }, [
                e('label', { class: 'control-label' }),
                e('div', { class: 'controls controls-join' }, [
                  e("input", { type: "submit", value: "Finish setup", class: 'btn btn-primary', disabled: inProgress }),
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
