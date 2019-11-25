import React, {useEffect, useState} from 'react';
import { withFirebase } from '../Firebase';

import drop from '../../resources/icons/drop.svg';
import temprature from '../../resources/icons/temprature.svg';

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
            console.log(snapshot.val());
            snapshot.forEach(childSnapshot => {
                const data = childSnapshot.val();
                props.firebase.device(data.uid).on('value', inner => {
                    deviceList.push(inner.val());
                    updateDevices(deviceList);
                    setNumDevices(deviceList.length);
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
                            placeholder="Add device" />
                            <button disabled={deviceID === ''} onClick={onSubmit} type="submit"> Add device </button>
                    </form>
                </div>
                <div className="header__avatar">Your face</div>
            </header>
            {loading && <main className="main">Loading ...</main>}
            {!loading && 
                <main className="main">
                    <Overview devices={devices}/>
                    <div className="main-cards">
                        <div className="card">Card</div>
                        <div className="card">Card</div>
                        <div className="card">Card</div>
                    </div>
                </main>
            }                
            <footer className="footer">
                <div className="footer__copyright">&copy; 2019</div>
                <div className="footer__signature">Made in Norway</div>
            </footer>
        </div>
    );
}

const Overview = ({devices}) => {
    let count = 0;
    return (
        devices.map(device => (
            <div className="main-overview" key={device.uid+String(count++)}>
                <OverviewContent 
                    title={"Moister"} 
                    content={device.moister}
                    icon={drop}/>

                <OverviewContent 
                    title={"Temprature"} 
                    content={device.temprature.toFixed(2) + "°C"}
                    icon = {temprature}/>
            </div>
            
        ))
    );
}

const OverviewContent = ({key, title, content, icon}) => (
    <div className="overviewcard" key={key}>        
        <div className="info">{content}</div>
        <div className="title">{title}</div>
        <img src={icon} alt-text='icon' className='overview-icon'/>
    </div>
);

export default withFirebase(Home);