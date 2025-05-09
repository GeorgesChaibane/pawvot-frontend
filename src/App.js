import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

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
import CheckoutPage from './components/Checkout/CheckoutPage';
import PetProducts from './components/Pet Products/PetProducts';
import Payment from './components/Payment/Payment';
import AZIndexPage from './components/AZIndex/AZIndexPage';
import OrderConfirmation from './components/OrderConfirmation/OrderConfirmation';
import OrderHistory from './components/UserAccount/OrderHistory';
import OrderDetail from './components/UserAccount/OrderDetail';
import MyBookings from './components/MyBookings/MyBookings';
import EditBooking from './components/EditBooking/EditBooking';
import PaymentPage from './components/Payment/PaymentPage';
import PaymentInfoPage from './components/Payment/PaymentInfoPage';
import OrdersPage from './components/Orders/OrdersPage';
import CashSuccessPage from './components/Payment/CashSuccessPage';
import EmailVerificationPage from './components/Verification/EmailVerificationPage';
import PetAIPage from './components/PetAI/PetAIPage';

import './components/Homepage/styles/variables.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/a-z-index" element={<AZIndexPage />} />
            <Route path="/verify-email" element={<EmailVerificationPage />} />
            
            {/* Protected routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/pets" element={<AllPetsPage />} />
              <Route path="/pets/:petId" element={<PetProfilePage />} />
              <Route path="/pets/:petId/book" element={<BookingPage />} />
              <Route path="/bookings" element={<MyBookings />} />
              <Route path="/bookings/edit/:bookingId" element={<EditBooking />} />
              <Route path="/products" element={<AllProductsPage />} />
              <Route path="/products/:productId" element={<PetProducts />} />
              <Route path="/cart" element={<ShoppingCartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/payment/:orderId" element={<PaymentPage />} />
              <Route path="/payment-info" element={<PaymentInfoPage />} />
              <Route path="/cash-success/:orderId" element={<CashSuccessPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/account/orders" element={<OrderHistory />} />
              <Route path="/orders/:orderId" element={<OrderDetail />} />
              <Route path="/petai" element={<PetAIPage />} />
            </Route>
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
