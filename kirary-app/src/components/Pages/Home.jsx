import React, {Component} from 'react';
import { withFirebase } from '../Firebase';

import drop from '../../resources/icons/drop.svg';
import temprature from '../../resources/icons/temprature.svg';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading: false,
          users: [],
        };
    }
    
    componentDidMount() {
        this.setState({ loading: true });

        this.props.firebase.devices().on('value', snapshot => {
          const usersObject = snapshot.val();

          const usersList = Object.keys(usersObject).map(key => ({
            ...usersObject[key],
            uid: key,
          }));

          this.setState({
            users: usersList,
            loading: false,
          });
        });
    }

    componentWillUnmount() {
        this.props.firebase.users().off();
    }

    render() {
        const { users, loading } = this.state;

        return (
            <div>
                {loading && <div>Loading ...</div>}
                {!loading && 
                    <div class="grid-container">
        
                        <main class="main">
                            <Overview devices={users}/>
       
                    
                            <div class="main-cards">
                                <div class="card">Card</div>
                                <div class="card">Card</div>
                                <div class="card">Card</div>
                            </div>
                        </main>
                        
                        <footer class="footer">
                            <div class="footer__copyright">&copy; 2018 MTH</div>
                            <div class="footer__signature">Made with love by pure genius</div>
                        </footer>
                    </div>
                }
            </div>

        );
    }
}

const Overview = ({devices}) => (
    devices.map(device => (
        <div class="main-overview">
            <OverviewContent 
                key={device.uid} 
                title={"Moister"} 
                content={device.moister}
                icon={drop}/>

            <OverviewContent 
                key={device.uid} 
                title={"Temprature"} 
                content={device.temprature.toFixed(2) + "°C"}
                icon = {temprature}/>
        </div>
    ))
);

const OverviewContent = ({key, title, content, icon}) => (
    <div class="overviewcard" key={key}>
        <div class="title">{title}</div>        
        <div class="info">{content}</div>
        <img src={icon} className='overview-icon'/>
    </div>
);

export default withFirebase(Home);