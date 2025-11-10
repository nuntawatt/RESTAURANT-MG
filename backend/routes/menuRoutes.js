const express = require('express');
const router = express.Router();
const MenuItem = require('../models/menuItem');
const { protect } = require('../middleware/authMiddleware');

// Get all menu items
router.get('/', async (req, res) => {
    try {
        const menuItems = await MenuItem.find();
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add new menu item (protected route - only admin)
router.post('/', protect, async (req, res) => {
    try {
        const { name, description, price, category, image } = req.body;
        const menuItem = new MenuItem({
            name,
            description,
            price,
            category,
            image
        });
        
        const savedMenuItem = await menuItem.save();
        res.status(201).json(savedMenuItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get menu item by ID
router.get('/:id', async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        if (menuItem) {
            res.json(menuItem);
        } else {
            res.status(404).json({ message: 'Menu item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get menu items by category
router.get('/category/:category', async (req, res) => {
    try {
        const menuItems = await MenuItem.find({ category: req.params.category });
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;