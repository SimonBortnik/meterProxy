# meterProxy
This is a proxy component which forks the datastream: Requests are not only proxied to the target server but also sends a copy for further analysis via Mosquitto. This component was designed in conjunction with the [meterMaster](https://github.com/SimonBortnik/meterMaster) to enable usage-based metering, but can be used with any other component.

## Installation
Set up a [Mosquitto](https://mosquitto.org/download/) instance. I recommend using their [docker image](https://hub.docker.com/_/eclipse-mosquitto) since it saves you the annoying setup.

Change the IP address to your Mosquitto instance in app.js.
Change the target address to the target application.

```shell
$ npm install
$ node app.js
```
