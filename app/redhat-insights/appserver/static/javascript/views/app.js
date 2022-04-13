import * as Setup from "./setup.js";

define(["react", "splunkjs/splunk"], function (react, splunk_js_sdk) {
  const e = react.createElement;

  const SetupPage = () => {
    const hecName = 'redhatinsights';
    const defaultIndex = 'redhatinsights';
    const [hecToken, setHecToken] = react.useState('');
    const [status, setStatus] = react.useState('');
    const [step, setStep] = react.useState(0);
    const [isHecCopied, setIsHecCopied] = react.useState(false);
    const [isSetupOpened, setIsSetupOpened] = react.useState(false);

    const hecCreation = e("div", { class: 'setup_container', id: 'form_wizard' }, [
      e("div", null, [
        step == 0
          ? e(SetupForm, { hecName, defaultIndex, status, setStatus, setStep, step, setHecToken })
          :
          step == 1 ? e(SetupIntegration, {
            hecToken, 
            setStep, 
            step, 
            isHecCopied, 
            setIsHecCopied, 
            isSetupOpened, 
            setIsSetupOpened })
            :
            step == 2 ? ''
              :
              step == 3 ? '' : ''
      ])
    ])

    return e('div', {
      class: 'styleguide-forms-wizard', 'data-view': 'views/style_guide/Forms/Wizard',
      'data-cid': 'view262', version: '2'
    }, [
      e('div', {
        class: 'control shared-controls-stepwizardcontrol control-default step-wizard controls controls-join'
      }, [
        e('div', { class: 'wizard-label' }, ['Set up integration with Red Hat']),
        e('div', null, [
          e('div', { class: 'step-container first active completed', 'data-value': '0' }, [
            e('div', { class: 'step-indicator' }, [
              e('div', { class: 'connector left' }, [
                e('div'),
                e('div'),
              ]),
              e('div', { class: 'circle' }, null),
              e('div', { class: 'connector right' }, [
                e('div'),
                e('div'),
              ]),
            ]),
            e('div', null, [
              e('span', { class: 'step-label' }, ['Step 1: Create HEC index'])
            ])
          ]),
          e('div', { class: 'step-container' + (step >= 1 ? ' active completed' : ''), 'data-value': '1' }, [
            e('div', { class: 'step-indicator' }, [
              e('div', { class: 'connector left' }, [
                e('div'),
                e('div'),
              ]),
              e('div', { class: 'circle' }, null),
              e('div', { class: 'connector right' }, [
                e('div'),
                e('div'),
              ]),
            ]),
            e('div', null, [
              e('span', { class: 'step-label' }, ['Step 2: Create HEC token'])
            ])
          ]),
          e('div', { class: 'step-container' + (step >= 2 ? ' active completed' : ''), 'data-value': '2' }, [
            e('div', { class: 'step-indicator' }, [
              e('div', { class: 'connector left' }, [
                e('div'),
                e('div'),
              ]),
              e('div', { class: 'circle' }, null),
            ]),
            e('div', null, [
              e('span', { class: 'step-label' }, ['Step 3: Configure Splunk integration in Insights'])
            ])
          ]),
        ]),
        e('div', { class: 'clearfix' }, null)
      ]),
      hecCreation
    ]);
  }

  const SetupForm = ({ hecName, defaultIndex, status, setStatus, setStep, step, setHecToken }) => {
    const [inProgress, setInProgress] = react.useState(false);

    const handleSubmit = async () => {

      setInProgress(true);
      let hecToken;

      try {
        hecToken = await Setup.hecAndIndex(splunk_js_sdk, { hecName, defaultIndex });
      } catch (error) {
        setInProgress(false);
        setStatus(error.message);
        return;
      }
      setHecToken(hecToken);
    }

    return e('div', { class: 'setup-container' }, [
      e('div', null, [
        e('h3', null, 'Create HEC index'),
        e('p', null, `This process will create a HTTP Event Collector (HEC) in your Splunk instance 
                      to let you send data and application events to your Splunk deployment over Secure 
                      HTTP (HTTPS) protocol. HEC uses a token-based authentication model. In the next 
                      steps we are creating a HEC and generating a token that will be used by Insights.`),
      ]),
      e('fieldset', null, [
        e('div', { class: 'form form-horizontal' }, [
            e('div', { class: 'control-group shared-controls-controlgroup control-group-default' }, [
              e('label', { class: 'control-label' }, ['HEC name']),
              e("input", {
                class: 'custom-input',
                disabled: true, type: "text", name: "hecName", value: hecName
              }),
            ]),
            e('div', { class: 'control-group shared-controls-controlgroup control-group-default' }, [
              e('label', { class: 'control-label' }, ['Default index']),
              e("input", {
                class: 'custom-input',
                disabled: true, type: "text", name: "defaultIndex", value: defaultIndex
              }),
            ])
        ]),
      ]),
      e('div', { class: 'control-group shared-controls-controlgroup control-group-default' }, [
        e('label', { class: 'control-label' }),
        e('div', { class: 'controls controls-join' }, [
          e(WizardButton, { setStep, step, handleSubmit }),
          e('div', { class: 'inline-status' }, [status])
        ])
      ])])
  };

  const SetupIntegration = ({ hecToken, setStep, step, isHecCopied, setIsHecCopied, isSetupOpened, setIsSetupOpened }) => {
    const [setupUrl, setSetupUrl] = react.useState(`https://console.stage.redhat.com/settings/integrations/splunk-setup`);

    const handleSubmit = async () => {}

    const handleCopyHEC = async (event) => {
      event.preventDefault();
      navigator.clipboard.writeText(hecToken);
      setIsHecCopied(!isHecCopied);
    }

    return e('div', { class: 'setup-container' }, [
      e('div', { class: '' }, [
        e('h3', null, 'Create HEC token'),
        e('p', null, `Copy your HEC token to configure Splunk integration in Insights application. 
                      If a new tab does not appear, it could be due to your browser popup blocker.`),
        e('p', null, 'Once the Splunk configuration is complete, you will be able to navigate back to Splunk application.'),
        e('div', { class: 'alert alert-warning' }, [
          e('i', { class: 'icon-alert' }, null),
          ` A user with 'Organization administrator' permissions is required.`
        ])
      ]),
      e('fieldset', null, [
        e('div', { class: 'form form-horizontal container-text' }, [
            e('div', { class: 'control-group shared-controls-controlgroup control-group-default controls-join' }, [
              e('label', { class: 'control-label' }, ['HEC Token']),
              e("input", {
                class: 'custom-input',
                disabled: true, type: "text", name: "hecToken", value: hecToken
              }),
              e('div', { class: 'nav-buttons copy-btn' }, [
                e('a', { class: 'btn btn-primary', onClick: handleCopyHEC }, ['Copy HEC']),
              ])
            ])
        ]),
      ]),
      e('button', {
        class: 'btn btn-primary next-button', 'aria-disabled': 'false',
        disabled: (step === 1 && isHecCopied ? '' : 'disabled'),
        style: { display: 'inline-block' },
        onClick: handleSetupIntegration
      }, [
        e('span', { class: 'button-text' }, ['Next: Configure Splunk integration in Insights']),
      ]),
      e('div', { class: 'setup-container-submit' }, [
        e('h3', null, '2. Submit your changes'),
        e('p', null, `Have you finished the configuration of Splunk integration in Insights application? 
                      If yes, complete the integration with a button below.`),
      ]),
      e('div', { class: 'control-group shared-controls-controlgroup control-group-default' }, [
        e('label', { class: 'control-label' }),
        e('div', { class: 'controls controls-join' }, [
          e(WizardButton, { setStep, step, handleSubmit }),
          e('div', { class: 'inline-status' }, [status])
        ])
      ]),
      e('div', { class: 'modal hide fade' + (showModal ? ' in' : ''), id: 'setupModal', style: { display: (showModal ? 'block' : 'none') } }, [
        e('div', { class: 'modal-header' }, [
          e('h3', null, 'Splunk Set up')
        ]),
        e('div', { class: 'modal-body' }, [
          e('p', null, 'Are you done with the setup?')
        ]),
        e('div', { class: 'modal-footer' }, [
          e('a', { class: 'btn', onClick: () => { setshowModal(!showModal) } }, ['Close']),
          e('a', { class: 'btn btn-primary', onClick: handleFinishSetup }, ['Save changes'])
        ])
      ]),
      showModal ? e('div', { class: 'modal-backdrop fade in' }) : ''
    ]);
  };

  const WizardButton = ({ setStep, step, handleSubmit }) => {

    const handleNextStep = async (event) => {
      handleSubmit()
      setStep(currStep => currStep === 2 ? currStep : currStep + 1);
    }

    const handlePrevStep = async (event) => {
      setStep(currStep => currStep - 1);
    }

    return e('div', { class: 'nav-buttons' }, [
      (step > 0 ?
        e('a', {
          class: 'btn btn-secondary previous-button', 'aria-disabled': 'false',
          style: { display: 'inline-block' },
          onClick: handlePrevStep
        }, [
          e('i', { class: 'icon-chevron-left' }, null),
          e('span', { class: 'button-text' }, [' Back'])
        ]) : null ),
      e('a', {
        class: 'btn btn-primary next-button', 'aria-disabled': 'false',
        style: { display: 'inline-block' },
        onClick: handleNextStep
      }, [
        e('span', { class: 'button-text' }, [step === 1 ? 'Next: Configure Splunk integration in Insights ' : 'Next ']),
        e('i', { class: 'icon-chevron-right' }, null)
      ]),
    ]);

  }

  return e(SetupPage);
});
