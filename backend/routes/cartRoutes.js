const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const { protect } = require('../middleware/authMiddleware');

// Get user's cart
router.get('/', protect, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id })
            .populate('items.menuItem', 'name price image');
        
        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: [],
                total: 0
            });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add item to cart
router.post('/add', protect, async (req, res) => {
    try {
        const { menuItemId, quantity } = req.body;
        let cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart) {
            cart = new Cart({
                user: req.user._id,
                items: [],
                total: 0
            });
        }

        // Check if item already exists in cart
        const existingItem = cart.items.find(item => 
            item.menuItem.toString() === menuItemId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                menuItem: menuItemId,
                quantity: quantity,
                price: req.body.price
            });
        }

        // Recalculate total
        cart.total = cart.items.reduce((total, item) => 
            total + (item.price * item.quantity), 0
        );

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Remove item from cart
router.delete('/remove/:itemId', protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => 
            item._id.toString() !== req.params.itemId
        );

        // Recalculate total
        cart.total = cart.items.reduce((total, item) => 
            total + (item.price * item.quantity), 0
        );

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Clear cart
router.delete('/clear', protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        cart.total = 0;
        await cart.save();
        
        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;