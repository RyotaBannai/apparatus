import React from "react";
import { NavLink } from "react-router-dom";

export default function Layout() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <a className="navbar-brand" href="/">
        Apparatus
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink exact to="/item" activeClassName="active">
              <div className="nav-link">
                Main <span className="sr-only">(current)</span>
              </div>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink exact to="/sub" activeClassName="active">
              <div className="nav-link">
                Sub <span className="sr-only">(current)</span>
              </div>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink exact to="/pagination" activeClassName="active">
              <div className="nav-link">
                Pagination <span className="sr-only">(current)</span>
              </div>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink exact to="/login" activeClassName="active">
              <div className="nav-link">
                Login <span className="sr-only">(current)</span>
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink exact to="/signin" activeClassName="active">
              <div className="nav-link">
                Sign In <span className="sr-only">(current)</span>
              </div>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
