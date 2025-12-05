import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import { useNotify } from './NotifyContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const notify = useNotify();

    const refreshCart = useCallback(async () => {
        try {
            const { data } = await api.get('/api/cart');
            setCart(data);
        } catch (error) {
            // If the user is not authenticated, keep an empty cart structure without spamming notifications
            setCart({ items: [], totalAmount: 0, currency: 'INR' });
        } finally {
            setLoading(false);
        }
    }, []);

    const addItem = useCallback(async (payload) => {
        try {
            await api.post('/api/cart/add', payload);
            await refreshCart();
            notify.success('Added to cart');
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to add to cart';
            notify.error(message);
            throw error;
        }
    }, [refreshCart, notify]);

    const updateItem = useCallback(async (itemId, payload) => {
        try {
            await api.put(`/api/cart/item/${itemId}`, payload);
            await refreshCart();
        } catch (error) {
            const message = error.response?.data?.message || 'Unable to update cart item';
            notify.error(message);
            throw error;
        }
    }, [refreshCart, notify]);

    const removeItem = useCallback(async (itemId) => {
        try {
            await api.delete(`/api/cart/item/${itemId}`);
            await refreshCart();
            notify.info('Item removed');
        } catch (error) {
            const message = error.response?.data?.message || 'Unable to remove item';
            notify.error(message);
            throw error;
        }
    }, [refreshCart, notify]);

    const clearCart = useCallback(async () => {
        try {
            await api.delete('/api/cart/clear');
            await refreshCart();
            notify.info('Cart cleared');
        } catch (error) {
            const message = error.response?.data?.message || 'Unable to clear cart';
            notify.error(message);
            throw error;
        }
    }, [refreshCart, notify]);

    const checkout = useCallback(async (payload = {}) => {
        setProcessing(true);
        try {
            const { data } = await api.post('/api/bookings/checkout', payload);
            await refreshCart();
            notify.success('Payment successful');
            return data;
        } catch (error) {
            const message = error.response?.data?.message || 'Checkout failed';
            notify.error(message);
            throw error;
        } finally {
            setProcessing(false);
        }
    }, [refreshCart, notify]);

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
