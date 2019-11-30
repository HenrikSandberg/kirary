import React, {useEffect, useState} from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';

import Loading from '../SimpleComponents/Loading';
import * as ROUTES from '../../constants/routes';

const AccountPage = (props) => {
  const [user, setUser] = useState(null);
  const [changePassword, setChange] = useState(false);

  const [passwordOne, setPasswordOne] = useState('');
  const [passwordTwo, setPasswordTwo] = useState('');
  const [error, setError] = useState(null);

  useEffect(()=> {
      if (user === null) {
          props.firebase.auth.onAuthStateChanged(user => {
              if (user) {
                props.firebase.user(user.uid).on('value', snap => {
                  setUser(snap.val());
                })
              }
          });
      }
  }, [user]);

  const change = () => setChange(!changePassword);


  const onSubmit = event => {
    props.firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        setPasswordOne('');
        setPasswordTwo('');
        setError(null);
        change();
      })
      .catch(error => {
        setError({ error });
      });
    event.preventDefault();
  };


  const onChangeOne = event => {
    setPasswordOne(event.target.value);
  };

  const onChangeTwo = event => {
    setPasswordTwo(event.target.value)
  }

  const onDelete = () => {
    props.firebase.doDeleteAccount();
    props.history.push(ROUTES.LANDING);
  }

  const isInvalid = passwordOne !== passwordTwo || passwordOne === '';

  return (
    <div>
      {user &&     
        <header className="header">
          <h2>Hello, {user.username}</h2>
        </header>
      }

      <div className='account-page'>{
        user === null ? <Loading/> :
          <main>
            <h3>{user.email}</h3>
            {changePassword ?
                <form onSubmit={onSubmit}>
                  <input
                    name="passwordOne"
                    value={passwordOne}
                    onChange={onChangeOne}
                    type="password"
                    placeholder="New Password"
                  />
                  <input
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange={onChangeTwo}
                    type="password"
                    placeholder="Confirm New Password"
                  />
                  <button disabled={isInvalid} type="submit">
                    Reset My Password
                  </button>
                  <button onClick={change} className='cancel-button'>
                    Cancel
                  </button>
                  {error && <div>{error.message}</div>}
                </form>
              : <button onClick={change}>Change Password</button>
            }
            {!changePassword && <button onClick={onDelete} className='deleteAccount'>Delete Account</button>}
          </main>
        }
    </div>
  </div>);
}
export default compose( withRouter, withFirebase,)(AccountPage);