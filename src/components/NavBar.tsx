import React from 'react';
import { Link } from 'react-router-dom';
import '../navbar.css'

const NavBar: React.FC = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">Add Client</Link>
        </li>
        <li>
          <Link to="/clients">All Clients</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
