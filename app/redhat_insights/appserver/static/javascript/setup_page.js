"use strict";

var app_name = "redhat_insights";

require.config({
  paths: {
    myApp: "../app/" + app_name + "/javascript/views/app",
    react: "../app/" + app_name + "/javascript/vendor/react.production.min",
    ReactDOM: "../app/" + app_name + "/javascript/vendor/react-dom.production.min",
    uuid: "../app/" + app_name + "/javascript/vendor/uuid",
    app: "../app/" + app_name + "/javascript/"
  },
  scriptType: "module",
});

require([
  "react",
  "ReactDOM",
  "myApp",
], (_react, ReactDOM, myApp) => {
  ReactDOM.render(myApp, document.getElementById('main_container'));
})

