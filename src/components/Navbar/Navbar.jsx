import "./Navbar.scss";
import { Link, NavLink } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import { FaShoppingCart, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { CartContext } from "../ShopContext/ShopContext";

const Navbar = () => {
  const { totalCartItems } = useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on component mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    // Listen for storage changes (for login/logout from other tabs)
    const handleStorageChange = () => {
      loadUser();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for login/logout within same tab
    const handleAuthChange = () => {
      loadUser();
    };

    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    
    // Clear cart
    localStorage.removeItem('cart');
    
    // Update state
    setUser(null);
    
    // Dispatch custom event for other components
    window.dispatchEvent(new Event('authChange'));
    
    // Redirect to home
    window.location.href = '/';
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const closeNav = () => {
    setIsOpen(false);
  };

  const [navBgc, setNavBgc] = useState(false);

  useEffect(() => {
    const changeBgc = () => {
      setNavBgc(window.scrollY > 10);
    };
    window.addEventListener("scroll", changeBgc);

    return () => {
      window.removeEventListener("scroll", changeBgc);
    };
  }, []);

  // Don't show anything while loading
  if (isLoading) {
    return (
      <nav className="navbar">
        <div className="navbar__container container">
          <Link to="/" className="navbar__logo">
            <p className="navbar__logo-text">FitnessClub</p>
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className={navBgc ? "navbar navbar__bgc" : "navbar"}>
      <div className="navbar__container container">
        <Link to="/" className="navbar__logo">
          <p className="navbar__logo-text">FitnessClub</p>
        </Link>
        <ul
          className={
            isOpen ? "navbar__links navbar__links-active" : "navbar__links"
          }>
          <li>
            <NavLink className="navbar__link" to="/" onClick={closeNav}>
              HOME
            </NavLink>
          </li>
          <li>
            <NavLink className="navbar__link" to="/about" onClick={closeNav}>
              ABOUT
            </NavLink>
          </li>
          <li>
            <NavLink className="navbar__link" to="/shop" onClick={closeNav}>
              SHOP
            </NavLink>
          </li>
          <li>
            <NavLink className="navbar__link" to="/faq" onClick={closeNav}>
              FAQ
            </NavLink>
          </li>
          <li>
            <NavLink className="navbar__link" to="/blog" onClick={closeNav}>
              BLOG
            </NavLink>
          </li>
          <li>
            <NavLink className="navbar__link" to="/contact" onClick={closeNav}>
              CONTACT
            </NavLink>
          </li>
          
          {/* Auth Links */}
          {user ? (
            <li className="navbar__user-menu">
              <NavLink className="navbar__link navbar__user" to="/profile" onClick={closeNav}>
                <FaUserCircle className="navbar__user-icon" />
                <span className="navbar__user-name">
                  {user.name ? user.name.split(' ')[0] : 'User'}
                </span>
              </NavLink>
              <button className="navbar__logout-btn" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </li>
          ) : (
            <li>
              <NavLink className="navbar__link" to="/login" onClick={closeNav}>
                LOGIN
              </NavLink>
            </li>
          )}

          <li>
            <NavLink
              className="navbar__cart-link"
              to="/cart"
              onClick={closeNav}>
              <div className="navbar__cart">
                <span className="navbar__quantity">{totalCartItems()}</span>
                <FaShoppingCart className="navbar__basket" />
              </div>
            </NavLink>
          </li>
        </ul>
        <div className="navbar__hamburger" onClick={handleClick}>
          {isOpen ? <AiOutlineClose /> : <GiHamburgerMenu />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;