import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import your components
import HomePage from './components/Homepage/HomePage';
import AllPetsPage from './components/See All Pets/AllPetsPage';
import PetProductsPage from './components/Pet Products/PetProducts';
import AllProductsPage from './components/See All Products/AllProductsPage';
import PetDetailsPage from './components/Pet Details/PetDetailsPage';
import BookingPage from './components/Booking/BookingPage';
import MyBookings from './components/MyBookings/MyBookings';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import ShoppingCartPage from './components/Shopping Cart/ShoppingCartPage';
import CheckoutPage from './components/Checkout/CheckoutPage';
import PaymentPage from './components/Payment/PaymentPage';
import PaymentInfoPage from './components/Payment/PaymentInfoPage';
import CashSuccessPage from './components/Payment/CashSuccessPage';
import OrdersPage from './components/Orders/OrdersPage';
import OrderDetail from './components/Orders/OrderDetail';
import NotFoundPage from './components/NotFoundPage';
import LoginPage from './components/Auth/Login';
import RegisterPage from './components/Auth/Register';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/pets" element={<AllPetsPage />} />
      <Route path="/pets/:petId" element={<PetDetailsPage />} />
      <Route path="/pets/:petId/book" element={<BookingPage />} />
      <Route path="/bookings" element={<MyBookings />} />
      <Route path="/products" element={<AllProductsPage />} />
      <Route path="/products/:id" element={<PetProductsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/cart" element={<ShoppingCartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/payment/:orderId" element={<PaymentPage />} />
      <Route path="/payment-info" element={<PaymentInfoPage />} />
      <Route path="/cash-success/:orderId" element={<CashSuccessPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/orders/:orderId" element={<OrderDetail />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes; 