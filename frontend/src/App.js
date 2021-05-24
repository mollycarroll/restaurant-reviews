import React from 'react';
import { Switch, Router, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import AddReview from './components/AddReview';
import Restaurant from './components/Restaurants';
import RestaurantsList from './components/RestaurantsList';
import Login from './components/Login';

function App() {
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
    </div>
  );
}

export default App;
