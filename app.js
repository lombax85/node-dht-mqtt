// configuration check
let config, mqtt, sensor;
try {
    config = require('./config');
} catch (ex) {
    console.log('Config not found. Remember to copy config.js.example and set variables. Exiting.');
    process.exit(1);
}

try {
    mqtt = require('mqtt');
} catch (ex) {
    console.log('mqtt package not found. Exiting.');
    process.exit(1);
}

try {
    sensor = require('node-dht-sensor');
} catch (ex) {
    console.log('node-dht-sensor package not installed or not correctly configured. TEST temperature (99) and humidity (1) will be used');
}

// exit after configured timeout
setTimeout((function() {
    return process.exit(1);
}), config.other_options.timeout);

let client  = mqtt.connect(config.mqtt_data.host, { port: config.mqtt_data.port, username: config.mqtt_data.username, password: config.mqtt_data.password});

client.on('connect', function () {

    if (sensor) {
        sensor.read(config.sensor_data.dht_version, config.sensor_data.pin_number, function(err, temperature, humidity) {
            if (!err) {
                let temp = temperature.toFixed(1);
                let hum = humidity.toFixed(1);
                client.publish(config.mqtt_data.topic, JSON.stringify({temperature: temp, humidity: hum}));
                client.end();
                console.log('Correctly published temperature: '+ temp + ' and humidity: ' + hum);
            }
        });
    } else {
        // mock temperature
        let temp = 99;
        let hum = 1;
        client.publish(config.mqtt_data.topic, JSON.stringify({temperature: temp, humidity: hum}));
        client.end();
        console.log('Correctly published TEST temperature: '+ temp + ' and humidity: ' + hum);
    }

});

