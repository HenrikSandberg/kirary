import app from 'firebase/app';
import 'firebase/auth';

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
    }

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
    
    doPasswordUpdate = password =>
      this.auth.currentUser.updatePassword(password);
}
export default Firebase;