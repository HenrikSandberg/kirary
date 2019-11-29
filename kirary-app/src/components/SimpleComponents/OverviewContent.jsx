import React from 'react';

const OverviewContent = ({key, title, content, icon, minimum}) => {
    const setBG = () => {
        let  color = '';
        if (title == "Moister") {
            color = (content > minimum) ? '#0984e3' : '#e17055';
            content = content > minimum ? 'Moist' : 'Dry';
            return color;

        } else if (title == "Temprature") {
            let color = '';
            if (content <= 0){
                color = '#81ecec';
            } else if (content > 0 && content <= 10.5) {
                color = '#55efc4';
            } else if (content > 10.5 && content <= 30) {
                color = '#00b894';
            } else {
                color = '#e17055';
            }
            content = content.toFixed(2) + "°C";
            return color;

        } else { 
            let color = '';
            if (content <= 500){
                color = '#2d3436';
                content = "None";

            } else if (content > 500 && content <= 1000) {
                color = '#e17055';
                content = "Low";

            } else if (content > 1000 && content <= 4200) {
                color = '#fdcb6e';
                content = "Good";

            } else {
                color = '#e17055';
                content = "High";
            }
            return color;
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

export default OverviewContent;