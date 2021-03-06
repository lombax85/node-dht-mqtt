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

// ---------------------------------------- main script --------------------------------------------------//

// exit after configured timeout
setTimeout((function() {
    console.log('Timeout reached, exiting');
    process.exit(1);
}), config.other_options.timeout);

let client  = mqtt.connect(config.mqtt_data.host, { port: config.mqtt_data.port, username: config.mqtt_data.username, password: config.mqtt_data.password});


main().then(
    () => {
        console.log('Exiting');
        process.exit(0);
}).catch(
    (message) => {
        console.log(message);
        process.exit(0);
    }
);

// ---------------------------------------- async functions --------------------------------------------------//

function main() {
    return new Promise((resolve, reject) => {
        client.on('connect',
            async () => {
                let temperature = parseFloat(process.argv[2]);
                let humidity = parseFloat(process.argv[3]);
                let battery = parseFloat(process.argv[4]);

                if (isNaN(temperature)) {
                    reject('Temperature is not a number');
                    return;
                }

                if (isNaN(humidity)) {
                    reject('Humidity is not a number');
                    return;
                }

                if (isNaN(battery)) {
                    reject('Battery is not a number');
                    return;
                }

                await publishData(null, temperature, humidity, battery).then(() => resolve());
            }
        );
    });
}

async function publishData(error, temperature, humidity, battery) {
    try {
        if (temperature != 0 && humidity != 0 && battery != 0) {
            await client.publish(config.mqtt_data.topic, JSON.stringify({temperature: temperature, humidity: humidity, battery: battery}));
            await client.end();
            console.log('Correctly published temperature: '+ temperature + ' and humidity: ' + humidity + ' and battery: ' + battery);
        }
    } catch (e) {
        console.log(e.stack);
        process.exit(1);
    }
}