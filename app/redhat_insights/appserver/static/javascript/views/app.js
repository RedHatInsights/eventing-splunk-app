import { validate_uuidv4 } from "./util.js";

export const appNamespace = {
  owner: "Red Hat",
  app: "redhat_insights",
  sharing: "app",
};

define(["react", "splunkjs/splunk", "splunkjs/mvc", "app/views/setup", 'app/views/setup_configuration'], function (react, splunk_js_sdk, mvc, Setup, Config) {
  const e = react.createElement;

  const SetupPage = () => {
    const hecName = 'redhatinsights';
    const defaultIndex = 'redhatinsights';
    const stanzaName = `http://${hecName}`;
    const [hecToken, setHecToken] = react.useState('');
    const [step, setStep] = react.useState(0);
    const [isHecCopied, setIsHecCopied] = react.useState(false);
    const [isUrlCopied, setIsUrlCopied] = react.useState(false);
    const [isSetupOpened, setIsSetupOpened] = react.useState(false);
    const [hecUrl, _setHecUrl] = react.useState('https://' + window.location.hostname + ':8088')
    const [splunkVersion, setSplunkVersion] = react.useState('');
    const [appVersion, setAppVersion] = react.useState('');

    const getSplunkVersion = async () => {
      try {
        const version = await Setup.getSplunkVersion(splunk_js_sdk);
        setSplunkVersion(version);
      } catch (error) {
        console.error(error);
      }
    };

    const getAppVersion = async () => {
      try {
        const version = await Setup.getAppVersion(splunk_js_sdk);
        setAppVersion(version);
      } catch (error) {
        console.error(error);
      }
    }

    const validateAppIsConfigured = async () => {
      try{
        // Validate if the app is already configured
        const isConfigured = await Config.is_app_configured(splunk_js_sdk);
        if (isConfigured){
          Config.redirect_to_splunk_app_homepage(app_name);
        }
      } catch (error) {
        console.error(error)
      }
    }

    react.useEffect(() => {
      validateAppIsConfigured();
      getSplunkVersion();
      getAppVersion();
    }, []);


    const hecCreation = e("div", { class: 'setup_container', id: 'form_wizard' }, [
      e("div", null, [
        step == 0
          ? e(SetupForm, { hecName, defaultIndex, setStep, step, setHecToken, stanzaName })
          :
          step == 1 ? e(SetupIntegration, {
            hecToken,
            setStep,
            step,
            isHecCopied,
            setIsHecCopied,
            isSetupOpened,
            setIsSetupOpened,
            hecUrl,
            isUrlCopied,
            setIsUrlCopied,
            splunkVersion,
            appVersion
          })
            :
            step == 2 ? e(SetupFinal, { setStep, step }) : ''
      ])
    ])

    return e('div', {
      class: 'styleguide-forms-wizard', 'data-view': 'views/style_guide/Forms/Wizard',
      'data-cid': 'view262', version: '2'
    }, [
      e('div', {
        class: 'control shared-controls-stepwizardcontrol control-default step-wizard controls controls-join'
      }, [
        e('div', { class: 'wizard-label' }, ['Set up integration with Red Hat Insights']),
        e('div', null, [
          e('div', { class: 'step-container first active' + (step >= 1 ? ' completed' : ''), 'data-value': '0' }, [
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
              e('span', { class: 'step-label' }, ['Step 1: Create Index and HEC'])
            ])
          ]),
          e('div', { class: 'step-container' + (step == 1 ? ' active' : '') + (step >= 2 ? ' active completed' : ''), 'data-value': '1' }, [
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
              e('span', { class: 'step-label' }, ['Step 2: Configure Splunk integration in Insights'])
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
              e('span', { class: 'step-label' }, ['Step 3: Review'])
            ])
          ]),
        ]),
        e('div', { class: 'clearfix' }, null)
      ]),
      hecCreation
    ]);
  }

  const SetupForm = ({ hecName, defaultIndex, setStep, step, setHecToken, stanzaName }) => {
    const [inProgress, setInProgress] = react.useState(false);
    const [error, setError] = react.useState();

    const getExistingHecToken = async (stanzaName) => {
      return new Promise((resolve, reject) => {
        mvc.createService().get(`/servicesNS/nobody/${app_name}/configs/conf-inputs`, {}, (err, res) => {
          if (err) {
            reject(err);
          } else {
            const obj = res.data.entry.find(element => element.name === stanzaName);
            resolve(obj?.content?.token);
          }
        });
      });
    }

    const handleSubmit = async () => {

      setInProgress(true);
      let hecToken;

      try {
        const token = await getExistingHecToken(stanzaName);
        if (!validate_uuidv4(token)) {
          hecToken = await Setup.hecAndIndex(splunk_js_sdk, { hecName, defaultIndex, stanzaName });
        } else {
          hecToken = token;
        }

      } catch (e) {
        setError(`HEC creation failed: ${e}.`);
        return false;
      }
      setInProgress(false);
      setHecToken(hecToken);
      return true;
    }

    return e('div', { class: 'setup-container' }, [
      e('div', { class: 'container-text' }, [
        e('h3', null, '1. Create Red Hat Default Index'),
        e('div', { class: 'alert alert-warning' }, [
          e('i', { class: 'icon-alert' }, null),
          e('span', null, `This step is required`)
        ]),
        e('p', null, [
          e('span', null, 'To create the index manually, go to '),
          e('a', {href: '/manager/redhat_insights/data/indexes', target: '_blank'}, ' Settings  \u279C  Indexes '),
          e('i',{class: 'icon-external'}),
          e('span', null, ' and create index: '),
          e('b', null, 'redhatinsights'),
        ]),
        e('p', null, [
          e('span', null, ' Make sure the index is '),
          e('b', null, 'enabled'),
          e('span', null, ' before continuing this setup.'),
        ]),
        e('p', null, `Once you finish the configuration of the Default index, follow the next step.`),
      ]),
      e('div', { class: 'container-text' }, [
        e('h3', null, '2. Create HEC'),
        e('p', null, `This process will create a HTTP Event Collector (HEC) in your Splunk instance
                      to let you send data and application events to your Splunk deployment over Secure
                      HTTP (HTTPS) protocol. HEC uses a token-based authentication model. In the next
                      steps we are creating a HEC and generating a token that will be used by Insights.`),
        e('div', { class: 'alert alert-warning' }, [
          e('i', { class: 'icon-alert' }, null),
          e('span', null, 'Check your '),
          e('a', {href: '/manager/redhat_insights/http-eventcollector', target: '_blank'}, 'Global Settings in HTTP Event Collector '),
          e('i',{class: 'icon-external'}),
          e('span', null, ' to ensure your HEC is enabled'),
        ]),
      ]),
      e('p', null, 'You can specify a HEC name and index used when sending Insights events.'),
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
        e('div', { class: 'controls controls-join wizard-step-control' }, [
          e(WizardButton, { setStep, step, handleSubmit, inProgress }),
          error ? e(AlertOnError, { error }) : null
        ])
      ])
    ])
  };

  const SetupIntegration = ({
    hecToken, setStep, step, isHecCopied, setIsHecCopied,
    isSetupOpened, setIsSetupOpened, hecUrl, isUrlCopied,
    setIsUrlCopied, splunkVersion, appVersion
  }) => {

    const [setupUrl, setSetupUrl] = react.useState('https://console.redhat.com/settings/integrations/splunk-setup');

    react.useEffect(() => {
      setSetupUrl(`https://console.redhat.com/settings/integrations/splunk-setup?appVersion=${appVersion}&splunkVersion=${splunkVersion}`);
    }, [splunkVersion, appVersion]);

    const handleSetupIntegration = async () => {
      window.open(setupUrl);
      setIsSetupOpened(true);
    }

    const copyToClipboard = (textToCopy) => {
      // navigator clipboard api needs a secure context (https)
      if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard api method'
        return navigator.clipboard.writeText(textToCopy);
      } else {
        // text area method
        let textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        // make the textarea out of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
          // here the magic happens
          document.execCommand('copy') ? res() : rej();
          textArea.remove();
        });
      }
    }

    const handleCopyURL = async (event) => {
      event.preventDefault();
      copyToClipboard(hecUrl);
      setIsUrlCopied(true);
    }

    const handleCopyHEC = async (event) => {
      event.preventDefault();
      copyToClipboard(hecToken);
      setIsHecCopied(true);
    }

    return e('div', { class: 'setup-container' }, [
      e('div', { class: '' }, [
        e('h3', null, '1. Configure Splunk integration in Insights'),
        e('p', null, `HEC is now configured in your Splunk deployment. Copy your HEC URL and Token to configure Splunk integration in Insights application.`),
        e('p', null, `If a new tab does not appear, it could be due to your browser popup blocker. Once the Splunk configuration is complete, you will be able to navigate back to Splunk application.`),
        e('div', { class: 'alert alert-warning' }, [
          e('i', { class: 'icon-alert' }, null),
          ` A user with 'Organization administrator' permissions is required.`
        ])
      ]),
      e('fieldset', null, [
        e('div', { class: 'form form-horizontal container-text' }, [
          e('div', { class: 'control-group shared-controls-controlgroup control-group-default controls-join' }, [
            e('label', { class: 'control-label' }, ['HEC URL']),
            e("input", {
              class: 'custom-input',
              disabled: true, type: "text", name: "hecUrl", value: hecUrl
            }),
            e('div', { class: 'nav-buttons copy-btn' }, [
              e('a', { class: 'btn default', onClick: handleCopyURL }, ['Copy']),
            ])
          ]),
          e('div', { class: 'control-group shared-controls-controlgroup control-group-default controls-join' }, [
            e('label', { class: 'control-label' }, ['HEC Token']),
            e("input", {
              class: 'custom-input',
              disabled: true, type: "text", name: "hecToken", value: hecToken
            }),
            e('div', { class: 'nav-buttons copy-btn' }, [
              e('a', { class: 'btn default', onClick: handleCopyHEC }, ['Copy']),
            ])
          ]),

        ]),
      ]),
      e('button', {
        class: 'btn btn-primary next-button', 'aria-disabled': 'false',
        disabled: false,
        style: { display: 'inline-block' },
        onClick: handleSetupIntegration
      }, [
        e('span', { class: 'button-text' }, ['Next: Configure Splunk integration in Insights']),
      ]),
      e('div', { class: 'setup-container-submit' }, [
        e('h3', null, '2. Submit your changes'),
        e('p', null, `Have you finished the configuration of Splunk integration in Insights application?
                      If yes, complete the integration by clicking 'Complete' below`),
      ]),
      e('div', { class: 'control-group shared-controls-controlgroup control-group-default' }, [
        e('div', { class: 'controls controls-join wizard-step-control' }, [
          e(WizardButton, { setStep, step, isSetupOpened }),
        ])
      ]),
    ]);
  };

  const SetupFinal = ({ setStep, step }) => {
    const [inProgress, setInProgress] = react.useState(false);
    const [error, setError] = react.useState();

    const handleSubmit = async () => {
      setInProgress(true);
      try {
        await Setup.complete(splunk_js_sdk);
      } catch (e) {
        setError(`Completion failed: ${e}.`)
        return false;
      }
      return true;
    }

    return e('div', { class: 'setup-container' }, [
      e('div', null, [
        e('h3', null, 'Splunk Integration completed'),
        e('p', null, `Your Splunk integration with Red Hat Insights is ready.`),
        e('p', null, `Get started by exploring a dashboard.`)
      ]),
      e('div', { class: 'control-group shared-controls-controlgroup control-group-default' }, [
        e('div', { class: 'controls controls-join wizard-step-control' }, [
          e(WizardButton, { setStep, step, handleSubmit, inProgress }),
          error ? e(AlertOnError, { error }) : null
        ])
      ])]);
  }

  const WizardButton = ({ setStep, step, handleSubmit, isSetupOpened, inProgress }) => {

    const handleNextStep = async (_event) => {
      if (handleSubmit && await handleSubmit() === false) {
        return;
      }
      setStep(currStep => currStep === 2 ? currStep : currStep + 1);
    }

    const handlePrevStep = async (_event) => {
      setStep(currStep => currStep - 1);
    }

    return e('div', { class: 'nav-buttons' }, [
      (step > 0 ?
        e('button', {
          class: 'btn btn-secondary previous-button', 'aria-disabled': 'false',
          style: { display: 'inline-block' },
          disabled: inProgress ? 'disabled' : '',
          onClick: handlePrevStep
        }, [
          e('i', { class: 'icon-chevron-left' }, null),
          e('span', { class: 'button-text' }, [' Back'])
        ]) : null),
      e('button', {
        class: 'btn btn-primary next-button', 'aria-disabled': 'false',
        disabled: (step === 1 && (!isSetupOpened) || inProgress ? 'disabled' : ''),
        style: { display: 'inline-block' },
        onClick: handleNextStep
      }, [
        e('span', { class: 'button-text' }, [step === 1 ? 'Complete ' : step === 2 ? 'Go to dashboard ' : 'Next ']),
        e('i', { class: 'icon-chevron-right' }, null)
      ]),
    ]);
  };

  const AlertOnError = ({ error }) => (
    e('div', { class: 'alert alert-error alert-inline' }, [
      e('i', { class: 'icon-alert' }),
      'Error: ', error, ' Please try again. If the problem persists, ',
      e('a', { href: 'https://access.redhat.com/support/cases/#/case/new/open-case' }, [ 'contact us' ]),
      '.'
    ])
  );

  return e(SetupPage);
});
