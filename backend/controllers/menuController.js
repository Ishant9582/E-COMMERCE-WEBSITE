const Menu = require('../models/menuModel');

// Get all menu items
exports.getMenu = async (req, res) => {
  try {
    const menu = await Menu.find();
    //console.log(menu) ;
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.addMenuItem = async (req, res) => {
  const { name, category, price, availability } = req.body;
  console.log(req.body);

  if (!req.file) {
    return res.status(400).json({ message: 'Image is required' });
  }

  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  console.log(imageUrl);

  if (!name || !category || !price) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const menuItem = await Menu.create({
      name,
      category,
      price,
      availability: availability ?? true,
      imageUrl,
    });

    res.status(201).json(menuItem);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Update a menu item
exports.updateMenuItem = async (req, res) => {
  const { id } = req.params;
  const { name, category, price, availability } = req.body;
  
  if (!name || !category || !price) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  let imageUrl;
  console.log(req.file) ;
  if (req.file) {
    imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }

  try {
    const updatedFields = {
      name,
      category,
      price,
      availability: availability ?? true,
    };

    if (imageUrl) {
      updatedFields.imageUrl = imageUrl;  // Only update if new image is uploaded
    }

    const updatedMenu = await Menu.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!updatedMenu) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json(updatedMenu);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Delete a menu item
exports.deleteMenuItem = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMenu = await Menu.findByIdAndDelete(id);
    if (!deletedMenu) return res.status(404).json({ message: 'Menu item not found' });
    res.json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
