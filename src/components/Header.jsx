import React from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css"; // CSS Module을 import 합니다.

function Header() {
  return (
    // className에 styles 객체를 사용합니다.
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          FoundByMe
        </Link>
        <nav className={styles.nav}>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
