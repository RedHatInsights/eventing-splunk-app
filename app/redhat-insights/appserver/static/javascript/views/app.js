import * as Setup from "./store_secret.js";

define(["react", "splunkjs/splunk"], function(react, splunk_js_sdk){
  const e = react.createElement;

  const SetupPage = () =>  {
    const [password, setPassword] = react.useState();

    const handleChange = (event) => {
      setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
      event.preventDefault();

      await Setup.perform(splunk_js_sdk, { password })
    }

    return e("div", null, [
      e("h2", null, "Create a password to complete app setup."),
      e("div", null, [
        e("form", { onSubmit: handleSubmit }, [
          e("label", null, [
            "Password ",
            e("input", { type: "password", name: "password", value: password, onChange: handleChange })
          ]),
          e("input", { type: "submit", value: "Submit" })
        ])
      ])
    ]);
  };

  return e(SetupPage);
});
