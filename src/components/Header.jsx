// components/Header.js
import React from "react";
import logo from "../assets/logo-black.svg";
import "../App.css";

const Header = () => {
  return (
    <header className="app-header">
      <img src={logo} alt="Logo" className="logo" />
    </header>
  );
};

export default Header;
