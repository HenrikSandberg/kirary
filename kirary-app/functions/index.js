const functions = require('firebase-functions');

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