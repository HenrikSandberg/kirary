import React, {useEffect, useState} from 'react';
import { withFirebase } from '../Firebase';

import Overview from '../SimpleComponents/Overview';

const Home = (props) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [devices, setDevices] = useState([]);
    const [numDevices, setNumDevices] = useState(false)
    const [deviceID, setDeviceID] = useState('');

    useEffect(() => {
        if (user === null || user === undefined) {
            getUser();
        } else if (user && (numDevices !== devices.length)){
            getDevices();
        }
    }, [user, loading, devices, numDevices]);

    const getUser = () => {
        props.firebase.auth.onAuthStateChanged(user => {
			if (user) {
                setUser(user);
			} 
		});
    }

    const updateDevices = newDevices => {
        if (JSON.stringify(devices) !== (JSON.stringify(newDevices))) {
            setDevices([]);
            setDevices(newDevices);

            if (loading) setLoading(false);
        }
    }

    const getDevices = () => {
        let deviceList = [];
        props.firebase.getDevicesFromUser(user.uid).on('value', snapshot => {
            snapshot.forEach(childSnapshot => {
                const data = childSnapshot.val();
                props.firebase.device(data.uid).on('value', inner => {
                    const device = {...inner.val(), uid: data.uid};
                    let add = true;
                    
                    deviceList.forEach(item => {
                        if (item.uid === device.uid) {
                            add = false;
                        }
                    });

                    if (add) {
                        deviceList.push(device);
                        updateDevices(deviceList);
                        setNumDevices(deviceList.length);
                    }
                });
            });
        });
    }
    
    const onSubmit = event => {
        props.firebase.addDeviceToUnser(user.uid, deviceID);
        setDeviceID('');
        event.preventDefault();
    };

    const onChange = event => {
        setDeviceID(event.target.value);
    };

    return (
        <div className="grid-container">
            <header className="header">
                <div className="header__search">
                    <form onSubmit={onSubmit}>
                        <input
                            name="deviceID"
                            value={deviceID}
                            onChange={onChange}
                            type="text"
                            className='add_new_device'
                            placeholder="Add device" />
                            <button 
                                className='add_new_device_button'
                                htmlFor='input' 
                                disabled={deviceID === ''} 
                                onClick={onSubmit} 
                                type="submit"> 
                                    Add 
                            </button>
                    </form>
                </div>
            </header>
            {loading && <main className="main">Loading ...</main>}
            {!loading && 
                <main className="main">
                    {devices.map(device => 
                            <Overview 
                                key={device.uid}
                                device={device}
                                firebase={props.firebase}/>
                    )}
                </main>
            }                
            <footer className="footer">
                <div className="footer__copyright">&copy; 2019</div>
                <div className="footer__signature">Made in Norway</div>
            </footer>
        </div>
    );
}


export default withFirebase(Home);