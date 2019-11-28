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
            let maxWater = after.minimum_water;
        
            if (maxWater === undefined || maxWater === null) {
                maxWater = 1500;
            }
    
            if (after.water_storeage <= 1100) {
                return snapshot.after.ref.update({watering: false});
            }
    
            return snapshot.after.ref.update({watering: (moister <= maxWater)});
        }


        if (after.water_storeage <= 1100) {
            return snapshot.after.ref.update({watering: false});
        }

        return Promise;
    }
);