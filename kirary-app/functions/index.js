const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.waterPlant = functions.database
    .ref('devide/{deviceID}')
    .onUpdate((snapshot, context) => {
        //const deviceID = context.params.deviceID;
        const prev = snapshot.before.val();
        const after = snapshot.after.val();
        const minimum_water_storage = 1200;

        const moister = after.moister;
        const prevMoister = prev.moister;
        const water_tank = after.water_storeage;

        if (moister !== prevMoister) {
            let minimumWater = after.minimum_water;
        
            if (minimumWater === undefined || minimumWater === null) {
                minimumWater = 1200;
                snapshot.after.ref.update({minimumWater: minimumWater});
            }
    
            if (water_tank <= minimum_water_storage) {
                return snapshot.after.ref.update({watering: false});
            }
    
            return snapshot.after.ref.update({watering: (moister <= minimumWater)});
        }

        if (water_tank <= minimum_water_storage) {
            return snapshot.after.ref.update({watering: false});
        }

        return Promise;
    }
);

exports.sendAdminNotification = functions.database
    .ref().onUpdate((snapshot, context) => {
        const after = snapshot.after.val();
        const devices = after.devide;
        const users = after.users;
        const minimum_water_storage = 1200;

        Object.keys(devices).forEach(uid => {
            const device = devices[uid];

            Object.keys(users).forEach(userKey => {
                const user = users[userKey];
                const userDevices = user.devides;

                Object.keys(userDevices).forEach(deviceKey => {
                    const path = `users/${userKey}/devides/${deviceKey}/message`;

                    if (userDevices[deviceKey].uid === uid && !userDevices[deviceKey].message) {
                        if (device.water_storeage < minimum_water_storage) {
                            const payload = {notification: {
                                    title: 'Out of water',
                                    body: `You need to refill ${device.plant_type} water tank`
                                }   
                            };
                            
                            snapshot.after.ref.child(path).set(true);
                            return admin.messaging().sendToDevice(user.token, payload);
                            
                        } else if (device.temprature < 10.00) {
                            const path = `users/${userKey}/devides/${deviceKey}/message`;

                            if (userDevices[deviceKey].uid === uid && !userDevices[deviceKey].message) {
                                const payload = {notification: {
                                        title: 'Too cold',
                                        body:  `You need to refill ${device.plant_type}
                                            water tank. Temp is now ${device.temprature}`
                                    }   
                                };
                                
                                snapshot.after.ref.child(path).set(true);
                                return admin.messaging().sendToDevice(user.token, payload);

                            }
                        } else if (device.temprature > 10.0 || device.water_storeage > minimum_water_storage) {
                            snapshot.after.ref.child(path).set(false);
                            return Promise();
                        }
                    }
                });
            })

        });        
    }
);