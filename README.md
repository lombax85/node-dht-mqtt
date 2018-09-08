# node-dht-mqtt

A simple node.js app for Raspberry Pi that:

- reads temperature and humidity from your DHT11 - DHT22 sensor
- publish it to an MQTT broker of your choice


## Requirements

- Raspberry Pi (tested on Model B and Zero W).
The project dependency node-dht sensor won't work on other devices,
so npm -i will fail. Look at the debug section for additional info.
- DHT11 or DHT22 sensor
- node-gyp (global) npm install node-gyp -g

## Usage

- clone repo and install

```bash
# install required dependency node-gyp globally
npm install node-gyp -g

# clone repo
git clone git@github.com:lombax85/node-dht-mqtt.git
cd node-dht-mqtt

# install project dependencies
npm i

# copy configuration template
cp config.js.example config.js

```

- edit config.js

- add crontab
```bash
* * * * * node /path/to/node-dht-mqtt/app.js
```


## Debug
Since node-dht-sensor won't compile if you are not on a Raspberry Pi,
for debugging purposes there is a debug function.
If the node-dht-sensor package is not found, you will see a console
message and TEST data will be emitted (99 C° and 1% humidity).


