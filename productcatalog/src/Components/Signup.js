import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Box, Typography, Link } from "@mui/material";
import { useLocation,useNavigate } from "react-router-dom"; // Import useNavigate hook
import img from "../Images/image.png";
import axios from "axios";

const SignUpPage = () => {
  const [isSignUp, setIsSignUp] = useState(true); // State to toggle between sign-up and login
  const navigate = useNavigate(); // Initialize the navigate function
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState(""); // State for repeat password in signup
  const [error, setError] = useState("");
  const [username, setUsername] = useState(""); // Corrected variable name to camelCase
  const location = useLocation();

  const toggleForm = () => {
    setIsSignUp((prev) => !prev);
    setError(""); // Clear error messages when switching forms
  };

  // const handleButtonClick = () => {
  //   setIsSignUp(!isSignUp); // Toggle the state
  // };
  useEffect(() => {
    if (location.state?.showLogin) {
      setIsSignUp(false); // Set to login form if navigating with showLogin state
    }
  }, [location.state]);
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      // Handle successful login
      console.log("Login successful", response.data);
      navigate("/navbar"); // Redirect to Navbar component after successful login
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password || !repeatPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/signup", {
        username,
        email,
        password,
      });

      // Store the username in local storage
      localStorage.setItem("username", response.data.user.username);

      // Redirect to the login page after successful signup
      setIsSignUp(false);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        height: "100vh",
        padding: 0,
        width: "100%",
        overflow: "hidden",
        backgroundImage: `url(${img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box sx={{ flex: 1, height: { xs: "40vh", md: "100vh" } }} />
      <Box
        sx={{
          flex: { md: 0.4 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1d1160",
          padding: "2rem",
          height: { xs: "80vh", md: "100vh" },
          position: "relative",
          transform: {
            xs: "translateX(0)", // No transform for small and medium screens
            lg: isSignUp ? "translateX(0)" : "translateX(-214%)", // Apply transform only for large screens and up
          },
          transition: "transform 0.5s ease-in-out", // Animation for sliding
          borderTopLeftRadius: "50px",
          borderTopRightRadius: "50px", // Ensure this is correctly set
          overflow: "hidden",
        }}
      >
        {isSignUp ? (
          <>
            <Typography
              variant="h4"
              sx={{ color: "#ffffff", marginBottom: "0.5rem", fontSize: { xs: "1.5rem" } }}
            >
              Sign Up
            </Typography>
            <Typography sx={{ color: "#ffffff", marginBottom: "0.5rem", fontSize: { xs: "1rem" } }}>
              Create your own account! 🚀
            </Typography>
            {error && (
              <Typography color="error" gutterBottom>
                {error}
              </Typography>
            )}
            <form onSubmit={handleSignUp}>
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ backgroundColor: "#ffffff", borderRadius: "4px", height: { xs: "55px" } }}
              />
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                type="email"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ backgroundColor: "#ffffff", borderRadius: "4px", height: { xs: "55px" } }}
              />
              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                type="password"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ backgroundColor: "#ffffff", borderRadius: "4px", height: { xs: "55px" } }}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                variant="outlined"
                type="password"
                margin="normal"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                sx={{ backgroundColor: "#ffffff", borderRadius: "4px", height: { xs: "55px" } }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  width: "100%",
                  marginTop: "1rem",
                  backgroundColor: "#ff6f61",
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#e65c50",
                  },
                }}
              >
                Sign Up
              </Button>
            </form>
            <Typography sx={{ color: "#ffffff", marginTop: "1rem" }}>
              Already have an account?{" "}
              <Link
                component="button"
                variant="body2"
                onClick={toggleForm}
                sx={{ color: "#ffffff", textDecoration: "underline", cursor: "pointer" }}
              >
                Sign In
              </Link>
            </Typography>
          </>
        ) : (
          <>
            {/* Login Content */}
            <Typography
              variant="h4"
              sx={{ color: "#ffffff", marginBottom: "0.5rem" }}
            >
              Login
            </Typography>
            <Typography sx={{ color: "#ffffff", marginBottom: "1rem" }}>
              Welcome Back! Please log in.
            </Typography>
            {error && (
              <Typography color="error" gutterBottom>
                {error}
              </Typography>
            )}
            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                type="email"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ backgroundColor: "#ffffff", borderRadius: "4px" }}
              />
              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                type="password"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ backgroundColor: "#ffffff", borderRadius: "4px" }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  width: "100%",
                  marginTop: "1rem",
                  backgroundColor: "#ff6f61",
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#e65c50",
                  },
                }}
              >
                Login
              </Button>
            </form>
            <Typography sx={{ color: "#ffffff", marginTop: "1rem" }}>
              Not registered yet?{" "}
              <Link
                component="button"
                variant="body2"
                onClick={toggleForm}
                sx={{ color: "#ffffff", textDecoration: "underline", cursor: "pointer" }}
              >
                Sign Up
              </Link>
            </Typography>
          </>
        )}
      </Box>
    </Container>
  );

};

export default SignUpPage;
