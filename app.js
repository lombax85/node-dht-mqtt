// --------------------------------- check and load deps -----------------------------------------------//
let config, mqtt, sensor;
try {
    config = require('./config');
} catch (ex) {
    console.log('Config not found. Remember to copy config.js.example and set variables. Exiting.');
    process.exit(1);
}

try {
    mqtt = require('async-mqtt');
} catch (ex) {
    console.log('mqtt package not found. Exiting.');
    process.exit(1);
}

try {
    sensor = require('node-dht-sensor');
} catch (ex) {
    console.log('node-dht-sensor package not installed or not correctly configured. TEST temperature (99) and humidity (1) will be used');
}

// ---------------------------------------- main script --------------------------------------------------//

// exit after configured timeout
setTimeout((function() {
    console.log('Timeout reached, exiting');
    process.exit(1);
}), config.other_options.timeout);

let client  = mqtt.connect(config.mqtt_data.host, { port: config.mqtt_data.port, username: config.mqtt_data.username, password: config.mqtt_data.password});


main().then(() => {
    console.log('Exiting');
    process.exit(0);
});

// ---------------------------------------- async functions --------------------------------------------------//

function main() {
    return new Promise((resolve, reject) => {
        client.on('connect',
            async () => {
                await readSensorAndExit();
                resolve();
            }
        );
    });
}

function readSensorAndExit() {
    return new Promise((resolve, reject) => {
        if (sensor) {
            // get real sensor data
            sensor.read(config.sensor_data.dht_version, config.sensor_data.pin_number, (err, temp, hum) => {
                publishData(err, temp, hum).then(() => resolve());
            });
        } else {
            // publish fake sensor data
            publishData(null, 99, 1).then(() => resolve());
        }
    });
}

async function publishData(error, temperature, humidity) {
    try {
        await client.publish(config.mqtt_data.topic, JSON.stringify({temperature: temperature, humidity: humidity}));
        await client.end();
        console.log('Correctly published temperature: '+ temperature + ' and humidity: ' + humidity);
    } catch (e) {
        console.log(e.stack);
        process.exit(1);
    }
}