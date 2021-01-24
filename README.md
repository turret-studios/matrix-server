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
to configure your server, copy `config.yml.example` to a file called `config.yml`. read through the config file and set your configuration.
## updating
when updating, keep in mind that the config specifications may update. a config update is required when the config version has incremented by a full whole number