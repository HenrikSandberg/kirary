import React, {Component} from 'react';
import { withFirebase } from '../Firebase';

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
            <div class="overviewcard" key={device.uid}>
                <div class="overviewcard__icon">Moister</div>
                <div class="overviewcard__info">{device.moister}</div>
            </div>
            <div class="overviewcard" key={device.uid}>
                <div class="overviewcard__icon">Temprature</div>
                <div class="overviewcard__info">{device.temprature}</div>
            </div>
        </div>
    ))
);

export default withFirebase(Home);