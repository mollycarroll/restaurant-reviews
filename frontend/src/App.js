import React from 'react';
import { Switch, Router, Link, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import AddReview from './components/AddReview';
import Restaurant from './components/Restaurant';
import RestaurantsList from './components/RestaurantsList';
import Login from './components/Login';

function App() {

  const [user, setUser] = React.useState(null);

  async function login(user = null) {
    setUser(user);
  }

  async function logout() {
    setUser(null);
  }

  return (
    <div>
      <nav className='navbar navbar-expand navbar-dark bg-dark'>
        <a href='/restaurants' className='navbar-brand'>
          Restaurant Reviews
        </a>
        <div className='navbar-nav mr-auto'>
          <li className='nav-item'>
            <Link to={'/restaurants'} className='nav-link'>
              Restaurants
            </Link>
          </li>

          <li className='nav-item'>
            { user ? (
              <a onClick={logout} className='nav-link' style={{cursor:'pointer'}}>
                Logout {user.name}
              </a>
            ) : (
              <Link to={'/login'} className='nav-link'>
                Login
              </Link>
            )}
          </li>

        </div>
      </nav>

      <div className='container mt-3'>
        <Switch>
          <Route exact path={['/', '/restaurants']} component={RestaurantsList} />

          {/* use render instead of component here to pass props */}
          <Route
            path='/restaurants/:id/review'
            render={(props) => (
              <AddReview {...props} user={user} />
            )}
          />

          <Route
            path='/restaurants/:id'
            render={(props) => (
              <Restaurant {...props} user={user} />
            )}
          />

          <Route
            path='/login'
            render={(props) => (
              <Login {...props} login={login} />
            )}
          />

        </Switch>
      </div>
    </div>
  );
}

export default App;
