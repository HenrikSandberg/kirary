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
    const [selected, setSelected] = useState(device.plant_type)
    const [plants, setPlants] = useState(null);
    
    const capitalize = s => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    const onSelect = (event) => {
        const content = event.target.value;

        if (content === "") {
            console.log('Empty string')
        } else {
            setSelected(content);
            firebase.setPlant(device.uid, content);
        }
    }

    const removeSelectedPlant = () => {
        setSelected(null);
        firebase.setPlant(device.uid, null);
    }

    const handleWaterClick = event => firebase.activateWater(event.target.value);
    const handlePlantTypes = () => {
        if (plants === null) {
            firebase.plants().once('value', snapshot =>  setPlants(snapshot.val()));
        }
    }
    
    handlePlantTypes()
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
                        <div className='device-name'>
                            Device: {device.uid}
                        </div>
                        <div className='water-text'>
                            {(device.water_storeage > 1100 ? "Enough water" : "Need to refill") }
                        </div>
                        {!selected && plants ?
                            <select id = "select-plant" onChange={onSelect}>
                                <option value="" disabled selected hidden>Choose a plant</option>
                                {Object.keys(plants).map((key, value) => 
                                    <option 
                                        key={key} 
                                        value={key}>
                                            {capitalize(key)}
                                    </option>)}
                            </select>
                            : <div> 
                                <div className='selected-plant-name'>
                                    {capitalize(selected)}
                                </div>
                                <button 
                                    className='reset-selected-plant-button'
                                    onClick={removeSelectedPlant}>
                                        Change plant
                                </button>
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

export default Overview;