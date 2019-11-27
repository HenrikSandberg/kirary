import React, {useEffect, useState} from 'react';
import { withFirebase } from '../Firebase';
import { LineChart, AreaChart } from 'react-chartkick'
import 'chart.js'

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
                            className='add_new_device'
                            placeholder="Add device" />
                            <button 
                                className='add_new_device_button'
                                for='input' 
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
                    <Overview devices={devices}/>
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
            <div key={device.uid+String(count++)}>
                <div className="main-overview">
                    {device.moister &&
                        <OverviewContent 
                            title={"Moister"} 
                            content={device.moister}
                            icon={drop}/>
                    }
                    {device.temprature &&
                        <OverviewContent 
                            title={"Temprature"} 
                            content={device.temprature}
                            icon = {temprature}/>
                    }      
                    {device.temprature &&
                        <OverviewContent 
                            title={"Temprature"} 
                            content={device.temprature}
                            icon = {temprature}/>
                    }               
                </div>

                <div className="main-cards">
                    {device.celcius_log && 
                        <div className="card">
                            <LineChart 
                                data={device.celcius_log} 
                                height="300px" 
                                width="90%" 
                                colors={["#00b894"]} 
                                title="Temprature"/>
                        </div>}

                    <div className="card">Card</div>

                    {device.moister_log && 
                        <div className="card">
                            <AreaChart 
                                data={device.moister_log} 
                                height="500px" 
                                width="90%" 
                                colors={["#0984e3"]} 
                                title="Water"/>
                        </div>}

                </div>
            </div>
        ))
    );
}

const OverviewContent = ({key, title, content, icon}) => {
    const setBG = () => {
        if (title == "Moister") {
            let color = (content < 2000) ? '#0984e3' : '#e17055';
            content = content < 2000 ? 'Good' : 'Needs water';
            return color;

        } else if (title == "Temprature") {
            let backGroundColor = '';
            if (content <= 0){
                backGroundColor = '#81ecec';
            } else if (content > 0 && content <= 10.5) {
                backGroundColor = '#55efc4';
            } else if (content > 10.5 && content <= 30) {
                backGroundColor = '#00b894';
            } else {
                backGroundColor = '#e17055';
            }
            content = content.toFixed(2) + "°C";
            return backGroundColor;

        } else { 
            /* TODO: When sunlight is added */ 

            // Nothing
            // Even less
            // Less
            // A LOT
        }
    }

    return (
        <div className="overviewcard" key={key} style={{backgroundColor: setBG()}}>      
            <div>
                <div className="info">{content}</div>
                <div className="title">{title}</div>
            </div>  
            <img src={icon} alt-text='icon' className='overview-icon'/>
        </div>
    );
}
export default withFirebase(Home);