import React, {useState} from 'react';
import { LineChart, AreaChart, ColumnChart } from 'react-chartkick';
import 'chart.js'

import OverviewContent from './OverviewContent';
import empty from '../../resources/icons/glass-empty.svg';
import full from '../../resources/icons/glass-full.svg';
import drop from '../../resources/icons/drop.svg';
import temprature from '../../resources/icons/temprature.svg';
import lightIcon from '../../resources/icons/sun.svg';

const Overview = ({firebase, device}) => {
    const [plants, setPlants] = useState(null);
    const [selectedPlant, setSelected] = useState(null);
    

    const capitalize = s => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    const onSelect = (event) => {
        setSelected(event.target.value);
    }

    const handleWaterClick = event => firebase.activateWater(event.target.value);
    const handlePlantTypes = () => firebase.plants().once('value', snapshot =>  {
        if (plants === null) {
            setPlants(snapshot.val())
        }
    });
    
    handlePlantTypes();
    return (
        <div>
            <div className="main-overview">
                {device.moister &&
                    <OverviewContent 
                        title={"Moister"} 
                        content={device.moister}
                        minimum={device.minimum_water}
                        icon={drop}/>
                }
                {device.temprature &&
                    <OverviewContent 
                        title={"Temprature"} 
                        content={device.temprature}
                        icon = {temprature}/>
                }      
                {device.light &&
                    <OverviewContent 
                        title={"Light"} 
                        content={device.light}
                        icon = {lightIcon}/>
                }               
            </div>

            <div className="main-cards">

                {device.water_storeage && 
                    <div className="card action-card" style={{backgroundColor: '#000'}}>
                        <div>
                            Device: {device.uid}
                        </div>
                        <div>
                            {(device.water_storeage > 1100 ? "Enigh water" : "Need to refill") }
                        </div>
                        {!device.plant_type && plants && selectedPlant === null ?
                            <select id = "myList" onChange={onSelect}>
                                {console.log(plants)}
                                {Object.keys(plants).map((key, index) => 
                                    <option 
                                        key={key} 
                                        value={key}>
                                            {capitalize(key)}
                                    </option>)}
                            </select>
                            : <div> 
                                {selectedPlant}
                                <button>Change plant</button>
                            </div>
                        }

                        <img src={(device.water_storeage > 1100 ? full : empty)} alt-text='icon'/>
                        <button 
                            disabled={device.water_storeage < 1100}
                            value={device.uid} 
                            onClick={handleWaterClick}> 
                                Water plant 
                        </button>
                    </div>
                }
                {device.celcius_log && 
                    <div className="card">
                        <LineChart 
                            data={device.celcius_log} 
                            height="100%" 
                            width="90%" 
                            colors={["#00b894"]} 
                            title="Temprature"/>
                    </div>}

                {device.light_log && 
                    <div className="card">
                        <AreaChart 
                            data={device.light_log} 
                            height="100%" 
                            width="90%" 
                            colors={["#fdcb6e"]} 
                            title="Light"/>
                    </div>
                }

                {device.moister_log && 
                    <div className="card">
                        <AreaChart 
                            data={device.moister_log} 
                            height="100%" 
                            width="90%" 
                            colors={["#0984e3"]} 
                            title="Water"/>
                    </div>}

            </div>
        </div>
    );
}

export default PresentPlant;