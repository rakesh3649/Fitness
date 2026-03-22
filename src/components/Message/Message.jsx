import "./Message.scss";
import { Link } from "react-router-dom";
import { AiOutlineMail } from "react-icons/ai";
import { useState, useEffect } from "react";

const Message = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  return (
    <section className="message">
      <h2 className="message__title">Experience Your First Session for Free</h2>
      <p className="message__text">
        Try our services at no cost and discover the workout that suits you
        best. Let us know your preferences, and we'll guide you to the perfect
        training plan.
      </p>
      {/* CHANGE: Only show Join Us button if NOT logged in */}
      {!isLoggedIn && (
        <Link className="message__link" to="/register">
          <AiOutlineMail className="message__icon" />
          JOIN US
        </Link>
      )}
    </section>
  );
};

export default Message;