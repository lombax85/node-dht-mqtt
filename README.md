# node-dht-mqtt

A simple node.js app for Raspberry Pi that:

- reads temperature and humidity from your DHT11 - DHT22 sensor
- publish it to an MQTT broker of your choice


## Requirements

- Raspberry Pi (tested on Model B and Zero W).
*Note: the project dependencies node-dht-sensor and BCM won't work on other devices,
so npm -i will fail. Look at the debug section for additional info.*
- DHT11 or DHT22 sensor
- node and build tools

## Usage

SSH to your Raspberry Pi and:

- install Broadcom BCM Library (for additional info: http://www.airspayce.com/mikem/bcm2835/ ) :

```bash
# example of installation
# download bcm
wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.56.tar.gz

# unpack
tar -xzvf bcm2835-1.56.tar.gz

# cd and compile
cd bcm2835-1.56/
./configure
make check
make install
```

- clone repo and install

```bash
# install required dependency node-gyp globally
npm install node-gyp -g

# clone repo
git clone https://github.com/lombax85/node-dht-mqtt.git
cd node-dht-mqtt

# install project dependencies (if you face permission errors add --unsafe-perm)
npm i --unsafe-perm

# copy configuration template
cp config.js.example config.js
```

- edit config.js

- test it:

```bash
node app.js
```

you should see a console message with Temp and Humidity

- add crontab to publish every minute
```bash
* * * * * node /path/to/node-dht-mqtt/app.js
```

## Config:

```javascript
let config = {
    mqtt_data: {
        username: 'xxx',            // your mqtt username
        password: 'xxx',            // your mqtt password
        port: 10109,                // mqtt port
        host: 'mqtt://url.com',     // mqtt url
        topic: 'topic/name'         // topic name, simple string
    },
    sensor_data: {
        dht_version: 11,            // Your DHT sensor version, 11 or 22
        pin_number: 17              // the GPIO you connected the DHT to. See below image
    },
    other_options: {
        timeout: 5000               // after this timeout the script will exit
    }
};

module.exports = config;

```

For the GPIO pinout see this image:

![Raspberry Pi Pinout](/gpio.png)


## Debug
Since node-dht-sensor and BCM won't compile if you are not on a Raspberry Pi,
for debugging purposes on your PC, there is an automatic debug function.
If the node-dht-sensor package is not found, you will see a console
message and TEST data will be emitted (99 C° and 1% humidity).


