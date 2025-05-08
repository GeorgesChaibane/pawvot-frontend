// import React, { createContext, useState, useContext, useEffect } from 'react';
// import AuthService from '../services/authService';
// import CartService from '../services/cartService';

// const AuthContext = createContext();

// export function useAuth() {
//   return useContext(AuthContext);
// }

// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const checkLoggedIn = async () => {
//       try {
//         const userData = await AuthService.getCurrentUser();
//         if (userData) {
//           setCurrentUser(userData);
//           setIsAuthenticated(true);
//           // Sync cart with server when user logs in
//           await CartService.syncCartWithServer();
//         } else {
//           setIsAuthenticated(false);
//         }
//       } catch (err) {
//         console.error('Error checking authentication:', err);
//         // If token is invalid, clear it
//         localStorage.removeItem('token');
//         setIsAuthenticated(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkLoggedIn();
//   }, []);

//   const login = async (email, password) => {
//     try {
//       setError(null);
//       const userData = await AuthService.login(email, password);
//       setCurrentUser(userData);
//       setIsAuthenticated(true);
//       // Sync cart with server when user logs in
//       await CartService.syncCartWithServer();
//       return userData;
//     } catch (err) {
//       setError(err.message || 'Login failed');
//       setIsAuthenticated(false);
//       throw err;
//     }
//   };

//   const signup = async (userData) => {
//     try {
//       setError(null);
//       const newUser = await AuthService.signup(userData);
//       setCurrentUser(newUser);
//       setIsAuthenticated(true);
//       // Sync cart with server when user signs up
//       await CartService.syncCartWithServer();
//       return newUser;
//     } catch (err) {
//       setError(err.message || 'Signup failed');
//       setIsAuthenticated(false);
//       throw err;
//     }
//   };

//   const logout = async () => {
//     try {
//       await AuthService.logout();
//       setCurrentUser(null);
//       setIsAuthenticated(false);
//       // Clear cart from localStorage on logout
//       localStorage.removeItem('cartItems');
//       // Dispatch a custom event to notify components of cart changes
//       window.dispatchEvent(new Event('storage'));
//     } catch (err) {
//       console.error('Error during logout:', err);
//     }
//   };

//   const value = {
//     currentUser,
//     login,
//     signup,
//     logout,
//     error,
//     setError,
//     isAuthenticated,
//     loading
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }; 