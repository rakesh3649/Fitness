import "./FixedBg.scss";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const FixedBg = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  return (
    <section className={props.cName}>
      <div className="fixed__content">
        <p className="fixed__text">{props.text}</p>
        <h2 className="fixed__title">{props.title}</h2>
        {/* CHANGE: Only show Join Us button if NOT logged in */}
        {!isLoggedIn && (
          <Link to="/register" className="fixed__link">
            JOIN US
          </Link>
        )}
      </div>
    </section>
  );
};

export default FixedBg;