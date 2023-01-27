"use strict";
exports.__esModule = true;
var fastify_1 = require("fastify");
var cors_1 = require("@fastify/cors");
var routes_1 = require("./routes");
var app = (0, fastify_1["default"])();
app.register(cors_1["default"], {
    origin: ['http://localhost:3000']
});
app.register(routes_1.appRoutes);
app
    .listen({
    port: 3333
})
    .then(function () {
    console.log('HTTP Server running!');
});
