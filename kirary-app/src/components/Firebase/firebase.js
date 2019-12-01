import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import "firebase/messaging";

const config = {
    apiKey: "AIzaSyDpEivc65FYQBnVTEWqSMaIETo5l0_6IsI",
    authDomain: "kirary-fad13.firebaseapp.com",
    databaseURL: "https://kirary-fad13.firebaseio.com",
    projectId: "kirary-fad13",
    storageBucket: "kirary-fad13.appspot.com",
    messagingSenderId: "392034894913",
    appId: "1:392034894913:web:e865433ab05dfe48bd72c0"
};

class Firebase {
    constructor() {
        app.initializeApp(config);
        this.auth = app.auth();
        this.db = app.database();
        this.messaging = app.messaging();

        this.messaging.usePublicVapidKey(
            'BNtetp8kFq3knkERlGiAQ2FNgI4kto8rS_Y4bFwjvTX9lkuTjZ46eRYgwWJUfUmWkX0LQAXTOIvoUu-KmMvoMUM'
        );
    }

    getCurrentUser = () => {
        this.auth.onAuthStateChanged((user) => {
            if (user) {
              return user;
            } 
        });
    }

    getMessaging = () => this.messaging;

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) => 
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
    
    doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

    doDeleteAccount = () => {
        const uid = this.auth.currentUser.uid
        this.user(uid).set(null);
        this.auth.currentUser.delete().then(()=> true).catch(()=> false);
    }


    //DATABASE GET
    user = uid => this.db.ref(`users/${uid}`);
    users = () => this.db.ref('users');
    devices = () => this.db.ref('devide');
    device = uid => this.db.ref(`devide/${uid}`);
    plants = () => this.db.ref('plants/');
    
    getDevicesFromUser = uid => this.db.ref(`users/${uid}/devides`);
    
    setPlant = (uid, plantName) => {
        if (plantName === null) {
            this.db.ref(`devide/${uid}/plant_type`).set(plantName);
        } else {
            this.db.ref(`plants/${plantName}`).on('value', snap => {
                this.db.ref(`devide/${uid}/plant_type`).set(plantName);
                this.db.ref(`devide/${uid}/minimum_water`).set(snap.val());
            });
        }
    }

    doSetUserToken = (uid, token) => this.db.ref(`users/${uid}/token`).set(token);

    addDeviceToUnser = (uid, deviceUid) => {
        this.device(deviceUid).on('value', snapshot => {
            if (snapshot.val() !== null) {
                this.getDevicesFromUser(uid).on('value', inner => {
                    if(!JSON.stringify(inner.val()).includes(deviceUid)){
                        this.db.ref(`users/${uid}`).child('devides').push().set({uid: deviceUid});
                    }
                });                
            }
        })
    }

    activateWater = uid => this.db.ref(`devide/${uid}/watering`).set(true); //.child('watering')

}

export default Firebase;