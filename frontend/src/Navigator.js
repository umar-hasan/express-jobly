import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import UserContext from "./UserContext";
import { Nav, Navbar, NavbarBrand } from "react-bootstrap"

export default function Navigation({ logout }) {
  const { currentUser } = useContext(UserContext);

  function loggedInNav() {
    return (
      <Nav className="ml-auto mr-2">
        <NavLink to="/companies">Companies</NavLink>
        <NavLink to="/jobs">Jobs</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <NavLink to="/" onClick={logout}>
          Logout
        </NavLink>
      </Nav>
    );
  }

  function regularNav() {
    return (
      <Nav className="ml-auto mr-2">
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/signup">Register</NavLink>
      </Nav>
    );
  }

  return (
    <div>
      <Navbar>
        <NavbarBrand>
          <Link to="/">Jobly</Link>
        </NavbarBrand>

        {currentUser ? loggedInNav() : regularNav()}

      </Navbar>
    </div>
  );
}
