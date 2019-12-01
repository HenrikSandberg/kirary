import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import App from './components/App';
import Firebase, { FirebaseContext } from './components/Firebase';
import './styles/index.scss';

if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("./firebase-messaging-sw.js")
        .then(registration => {
            console.log("Registration successful, scope is:", registration.scope);
        })
        .catch(err =>{
            console.log("Service worker registration failed, error:", err);
        });
}

ReactDOM.render(
    <FirebaseContext.Provider value={new Firebase()}>
        <App />
    </FirebaseContext.Provider>, document.getElementById('root'));
serviceWorker.register();
