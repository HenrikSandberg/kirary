const functions = require('firebase-functions');

exports.waterPlant = functions.database
    .ref('devide/{deviceID}')
    .onUpdate((snapshot, context) => {
        //const deviceID = context.params.deviceID;
        const prev = snapshot.before.val();
        const after = snapshot.after.val();

        const moister = after.moister;
        const prevMoister = prev.moister;

        if (moister !== prevMoister) {
            let minimumWater = after.minimum_water;
        
            if (minimumWater === undefined || minimumWater === null) {
                minimumWater = 1500;
                snapshot.after.ref.update({maxWater: minimumWater});
            }
    
            if (after.water_storeage <= 500) {
                return snapshot.after.ref.update({watering: false});
            }
    
            return snapshot.after.ref.update({watering: (moister <= minimumWater)});
        }


        if (after.water_storeage <= 1100) {
            return snapshot.after.ref.update({watering: false});
        }

        return Promise;
    }
);