# matrix-server-js
a matrix homeserver implementation entirely in javascript.
## implementations
all implementations are up to date with the minimum api versions as of 1-23-21.
client-server api: r0.6.1
server-server api: r0.1.4
application service api: r0.1.2
identity service api: r0.3.0
push gateway api: r0.1.1
## configuring
to configure your server, copy `config.json.example` to a file called `config.json`. read through the config file and set your configuration.
## updating
when updating, if the config.version has incremented by only a decimal, then a change in the config.json is not required.
otherwise, updating the config.json file is required and the server will fail to start without the necessary changes. view config changelog for more information