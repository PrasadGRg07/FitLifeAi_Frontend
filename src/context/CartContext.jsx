import React, { createContext, useState, useContext, useEffect } from 'react'

const cartContext = createContext();
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

    const fetchCart = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/users/cart/`);
            if (!res.ok) throw new Error('Failed to fetch cart');
            const data = await res.json();
            setCartItems(data.items || []);
            setTotal(data.total || 0);
        } catch (err) {
            console.error('Error fetching cart:', err);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const addToCart = async (product) => {
        try {
            const res = await fetch(`${BASE_URL}/api/users/cart/add/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_id: product.id })
            });
            if (res.ok) await fetchCart();
        } catch (err) {
            console.error('Error adding to cart:', err);
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            const res = await fetch(`${BASE_URL}/api/users/cart/remove/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ item_id: itemId })
            });
            if (res.ok) await fetchCart();
        } catch (err) {
            console.error('Error removing from cart:', err);
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            const res = await fetch(`${BASE_URL}/api/users/cart/update/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_id: productId, quantity })
            });
            if (res.ok) await fetchCart();
        } catch (err) {
            console.error('Error updating cart quantity:', err);
        }
    };

    return (
        <cartContext.Provider value={{ cartItems, total, addToCart, removeFromCart, updateQuantity }}>
            {children}
        </cartContext.Provider>
    );
};

export const useCart = () => useContext(cartContext);