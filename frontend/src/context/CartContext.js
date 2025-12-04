import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const refreshCart = useCallback(async () => {
        try {
            const { data } = await api.get('/api/cart');
            setCart(data);
        } catch (error) {
            // If the user is not authenticated, keep an empty cart structure without spamming toasts
            setCart({ items: [], totalAmount: 0, currency: 'INR' });
        } finally {
            setLoading(false);
        }
    }, []);

    const addItem = useCallback(async (payload) => {
        try {
            await api.post('/api/cart/add', payload);
            await refreshCart();
            toast.success('Added to cart');
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to add to cart';
            toast.error(message);
            throw error;
        }
    }, [refreshCart]);

    const updateItem = useCallback(async (itemId, payload) => {
        try {
            await api.put(`/api/cart/item/${itemId}`, payload);
            await refreshCart();
        } catch (error) {
            const message = error.response?.data?.message || 'Unable to update cart item';
            toast.error(message);
            throw error;
        }
    }, [refreshCart]);

    const removeItem = useCallback(async (itemId) => {
        try {
            await api.delete(`/api/cart/item/${itemId}`);
            await refreshCart();
            toast.info('Item removed');
        } catch (error) {
            const message = error.response?.data?.message || 'Unable to remove item';
            toast.error(message);
            throw error;
        }
    }, [refreshCart]);

    const clearCart = useCallback(async () => {
        try {
            await api.delete('/api/cart/clear');
            await refreshCart();
            toast.info('Cart cleared');
        } catch (error) {
            const message = error.response?.data?.message || 'Unable to clear cart';
            toast.error(message);
            throw error;
        }
    }, [refreshCart]);

    const checkout = useCallback(async (payload = {}) => {
        setProcessing(true);
        try {
            const { data } = await api.post('/api/bookings/checkout', payload);
            await refreshCart();
            toast.success('Payment successful');
            return data;
        } catch (error) {
            const message = error.response?.data?.message || 'Checkout failed';
            toast.error(message);
            throw error;
        } finally {
            setProcessing(false);
        }
    }, [refreshCart]);

    useEffect(() => {
        refreshCart();
        const interval = setInterval(refreshCart, 20000);
        const handleVisibility = () => {
            if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
                refreshCart();
            }
        };
        if (typeof document !== 'undefined') {
            document.addEventListener('visibilitychange', handleVisibility);
        }
        return () => {
            clearInterval(interval);
            if (typeof document !== 'undefined') {
                document.removeEventListener('visibilitychange', handleVisibility);
            }
        };
    }, [refreshCart]);

    const cartCount = useMemo(() => {
        if (!cart?.items) return 0;
        return cart.items.reduce((sum, item) => sum + item.quantity, 0);
    }, [cart]);

    const totals = useMemo(() => {
        const subtotal = cart?.totalAmount || 0;
        const taxes = Math.round(subtotal * 0.18);
        return {
            subtotal,
            taxes,
            grandTotal: subtotal + taxes,
            currency: cart?.currency || 'INR'
        };
    }, [cart]);

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                processing,
                cartCount,
                totals,
                refreshCart,
                addItem,
                updateItem,
                removeItem,
                clearCart,
                checkout
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);

export default CartContext;
