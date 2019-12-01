import React, {useEffect, useState} from 'react';
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

    useEffect(() => {
        if (selected === null || plants === null) {
            handlePlantTypes();
        }
        
    }, [selected, plants]);

    
    const capitalize = s => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    const onSelect = (event) => {
        const content = event.target.value;
        setSelected(content);
        firebase.setPlant(device.uid, content);
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

                {device.water_storeage >= 0 && 
                    <div className={"card action-card " + (device.water_storeage > 500 ? "full" : "empty")}>
                        <div className='device-name'>
                            Device: {device.uid}
                        </div>
                        <div className='water-text'>
                            {(device.water_storeage > 500 ? "Enough" : "Need to refill") }
                        </div>
                        {!selected && plants ?
                            <div className='main-focus-action'>
                                <select onChange={onSelect}>
                                    <option value="" disabled selected hidden>Choose a plant</option>
                                    {Object.keys(plants).map((key, value) => 
                                        <option 
                                            key={key} 
                                            value={key}>
                                                {capitalize(key)}
                                        </option>)}
                                </select>
                            </div>
                            : <div className='main-focus-action'> 
                                <div className='selected-plant-name'>
                                    {capitalize(selected)}
                                </div>
                                <button 
                                    className='reset-selected-plant-button'
                                    onClick={removeSelectedPlant}>
                                        Change
                                </button>
                            </div>
                        }
                        <div className='water-icon'>
                            <img 
                                src={(device.water_storeage > 500 ? full : empty)} 
                                alt-text='icon'/>
                        </div>
                        <button 
                            className='water-plant-button'
                            disabled={device.water_storeage < 500}
                            value={device.uid} 
                            onClick={handleWaterClick}> 
                                Water 
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
                            title="Moister"/>
                    </div>}

            </div>
        </div>
    );
}

export default Overview;