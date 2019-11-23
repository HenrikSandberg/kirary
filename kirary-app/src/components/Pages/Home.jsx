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
            <h1>Home</h1>
            
            {loading && <div>Loading ...</div>}

            <UserList users={users} />
          </div>
        );
    }
}

const UserList = ({ users }) => (
    <ul>
        {users.map(user => (
            <li key={user.uid}>
                <span>
                    <strong>ID:</strong> {user.uid}
                </span>

                <span>
                    <strong>Moister:</strong> {user.moister}
                </span>
                <span>
                    <strong>Temprature:</strong> {Math.round(user.temprature)}
                </span>
            </li>
        ))}
    </ul>
);

export default withFirebase(Home);