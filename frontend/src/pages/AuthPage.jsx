import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGoogle, FaFacebookF, FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import './AuthPage.css';

import { useNavigate } from "react-router-dom";


const AuthPage = () => {
    const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
const [acceptedTerms, setAcceptedTerms] = useState(false);
const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        },
        exit: {
            opacity: 0,
            x: -20,
            transition: { duration: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 300, damping: 24 }
        }
    };

    const brandingVariants = {
        hidden: { x: -50, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 }
        }
    };
const handleSignup = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");
     if (!acceptedTerms) {
    setError("Please accept Terms & Privacy Policy");
    return;
  }
  try {
    const res = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
   

    if (!res.ok) {
      setError(data.message);
    } else {
      setSuccess(data.message);
      setIsLogin(true); // switch to login
    }
  } catch (err) {
    setError("Server not reachable");
  }
};
const handleLogin = async (e) => {
  e.preventDefault();   // 🔴 THIS LINE FIXES EVERYTHING

  const res = await fetch("http://localhost:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message);
    return;
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  if (data.user.isAdmin) {
    navigate("/admin");
  } else {
    navigate("/home");
  }
};

    return (
        <div className="auth-container">
            <div className="auth-content">
                {/* Left Side: Branding */}
                <motion.div
                    className="auth-branding"
                    initial="hidden"
                    animate="visible"
                    variants={brandingVariants}
                >
                    <motion.div variants={itemVariants} className="brand-logo-container">
                        <div className="brand-icon">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h1 className="brand-name">ShopHub</h1>
                    </motion.div>

                    <motion.h2 variants={itemVariants} className="brand-headline">
                        Your Ultimate <br /> <span className="highlight-text">Shopping Destination</span>
                    </motion.h2>

                    <motion.p variants={itemVariants} className="brand-subtext">
                        Discover millions of products, exclusive deals, and seamless shopping experience.
                    </motion.p>

                    <motion.div variants={itemVariants} className="brand-stats">
                        <div className="stat-item">
                            <h3>2M+</h3>
                            <p>Products</p>
                        </div>
                        <div className="stat-item">
                            <h3>50K+</h3>
                            <p>Brands</p>
                        </div>
                        <div className="stat-item">
                            <h3>10M+</h3>
                            <p>Customers</p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right Side: Form */}
                <div className="auth-form-card">
                    <div className="auth-tabs">
                        <button
                            className={`auth-tab ${isLogin ? 'active' : ''}`}
                            onClick={() => setIsLogin(true)}
                        >
                            Login
                        </button>
                        <button
                            className={`auth-tab ${!isLogin ? 'active' : ''}`}
                            onClick={() => setIsLogin(false)}
                        >
                            Sign Up
                        </button>
                    </div>

                    <AnimatePresence mode='wait'>
                        {isLogin ? (
                            <motion.div
                                key="login"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="form-container"
                            >
                                <motion.div variants={itemVariants}>
                                    <h2>Welcome Back!</h2>
                                    <p className="form-subtitle">Login to continue shopping</p>
                                </motion.div>

                                <form onSubmit={handleLogin}>
                                    <motion.div variants={itemVariants} className="input-group">
                                        <label>Email Address</label>
                                        <div className="input-wrapper">
                                            <FaEnvelope className="input-icon" />
                                            <input
                                                type="email"
                                                placeholder="email@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </motion.div>

                                    <motion.div variants={itemVariants} className="input-group">
                                        <label>Password</label>
                                        <div className="input-wrapper">
                                            <FaLock className="input-icon" />
                                            <input
                                                 type={showPassword ? "text" : "password"}
                                                placeholder="Enter your password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                    </motion.div>

                                    <motion.div variants={itemVariants} className="form-actions">
                                        <label className="remember-me">
                                            <input type="checkbox" />
                                            Remember me
                                        </label>
                                        <a href="/" className="forgot-password">Forgot Password?</a>
                                    </motion.div>
                                   {error && <p className="error-text">{error}</p>}
                                {success && <p className="success-text">{success}</p>}

                                    <motion.button
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="submit-btn"
                                    >
                                        Login
                                    </motion.button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="signup"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="form-container"
                            >
                                <motion.div variants={itemVariants}>
                                    <h2>Create Account</h2>
                                    <p className="form-subtitle">Sign up to start shopping</p>
                                </motion.div>

                                <form onSubmit={handleSignup}>

                                    <motion.div variants={itemVariants} className="input-group">
                                        <label>Full Name</label>
                                        <div className="input-wrapper">
                                            <FaUser className="input-icon" />
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                    </motion.div>

                                    <motion.div variants={itemVariants} className="input-group">
                                        <label>Email Address</label>
                                        <div className="input-wrapper">
                                            <FaEnvelope className="input-icon" />
                                            <input type="email" placeholder="email@example.com"   value={email}  onChange={(e) => setEmail(e.target.value)}/>
                                        </div>
                                    </motion.div>

                                    <motion.div variants={itemVariants} className="input-group">
                                        <label>Password</label>
                                        <div className="input-wrapper">
                                            <FaLock className="input-icon" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                        <span className="input-hint">Must be at least 6 characters</span>
                                    </motion.div>

                                    <motion.div variants={itemVariants} className="form-actions checkbox-only">
                                        <label className="terms-check">
                                            <input type="checkbox" onChange={(e) => setAcceptedTerms(e.target.checked)}/>
                                            I agree to the <a href="/">Terms of Service</a> and <a href="/">Privacy Policy</a>
                                        </label>
                                    </motion.div>
                                    {error && <p className="error-text">{error}</p>}
                                    {success && <p className="success-text">{success}</p>}

                                    <motion.button
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="submit-btn"
                                    >
                                        Create Account
                                    </motion.button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div
                        className="social-login"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="divider">
                            <span>Or {isLogin ? 'continue' : 'sign up'} with</span>
                        </div>
                        <div className="social-buttons">
                            <button className="social-btn google">
                                <FaGoogle className="social-icon" /> Google
                            </button>
                            <button className="social-btn facebook">
                                <FaFacebookF className="social-icon" /> Facebook
                            </button>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default AuthPage;
