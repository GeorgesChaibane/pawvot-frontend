import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Homepage/Footer';

import Home from './components/Homepage/Home';
import LoginPage from './components/Login/LoginPage';
import SignupPage from './components/Singup/SignupPage';
import AllPetsPage from './components/See All Pets/AllPetsPage';
import PetProfilePage from './components/Pet Profile/PetProfilePage';
import BookingPage from './components/Booking/BookingPage';
import AllProductsPage from './components/See All Products/AllProductsPage';
import ShoppingCartPage from './components/Shopping Cart/ShoppingCartPage';
import Checkout from './components/Checkout/Checkout';
import SMSVerification from './components/SMS Verification/SMSVerification';
import PetProducts from './components/Pet Products/PetProducts';
import Payment from './components/Payment/Payment';
import AZIndexPage from './components/AZIndex/AZIndexPage';
import OrderConfirmation from './components/OrderConfirmation/OrderConfirmation';
import OrderHistory from './components/UserAccount/OrderHistory';
import OrderDetail from './components/UserAccount/OrderDetail';

import './components/Homepage/styles/variables.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/pets" element={<AllPetsPage />} />
          <Route path="/pets/:petId" element={<PetProfilePage />} />
          <Route path="/pets/:petId/book" element={<BookingPage />} />
          <Route path="/products" element={<AllProductsPage />} />
          <Route path="/products/:productId" element={<PetProducts />} />
          <Route path="/cart" element={<ShoppingCartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/verify" element={<SMSVerification />} />
          <Route path="/a-z-index" element={<AZIndexPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/account/orders" element={<OrderHistory />} />
          <Route path="/account/orders/:orderId" element={<OrderDetail />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
