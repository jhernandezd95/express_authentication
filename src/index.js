const express = require("express");
const settings = require("./settings/server");

const app = settings(express());

app.listen(app.get('port'), () => {
   console.log('Server on port', app.get('port'))
});