import App from './App';
import CartPage from './pages/CartPage/CartPage';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import HomePage from './pages/HomePage/HomePage';
import ShopPage from './pages/ShopPage/ShopPage';
import ItemPage from './pages/ItemPage/ItemPage';
import LoginPage from './pages/LoginPage/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import SuccessPage from './pages/SuccessPage/SuccessPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import { GuestRoute } from './components/GuestRoute/GuestRoute';
import UnauthorizedPage from './pages/UnauthorizedPage/UnauthorizedPage';
import OrdersPage from './pages/OrdersPage/OrdersPage';
import OrderDetailsPage from './pages/OrderDetailPage/OrderDetailPage';
import { redirect } from 'react-router';
import AdminCategoriesPage from './pages/AdminCategoriesPage/AdminCategoriesPage';
import AdminProductsPage from './pages/AdminProductsPage/AdminProductsPage';
import AdminLayout from './pages/AdminLayout/AdminLayout';

const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '/shop', element: <ShopPage /> },
      { path: '/shop/:id', element: <ItemPage /> },
      { path: '/unauthorized', element: <UnauthorizedPage /> },
      {
        element: <GuestRoute />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/cart', element: <CartPage /> },
          { path: '/success', element: <SuccessPage /> },
          { path: '/orders', element: <OrdersPage /> },
          { path: '/order/:id', element: <OrderDetailsPage /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['Admin']} />,
        children: [
          {
            path: 'admin',
            element: <AdminLayout />,
            children: [
              { index: true, loader: () => redirect('/admin/products') },
              { path: 'categories', element: <AdminCategoriesPage /> },
              { path: 'products', element: <AdminProductsPage /> },
            ],
          },
        ],
      },
    ],
  },
];

export default routes;
