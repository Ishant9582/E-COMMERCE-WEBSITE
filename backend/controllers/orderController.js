const Order = require('../models/orderModel');  // Importing Order model
const Menu = require('../models/menuModel');    // Importing Menu model

// Function to place an order
exports.placeOrder = async (req, res) => {
  const { items , status } = req.body;  // Extracting items from the request body
   // Logging the items to see what was sent

  // Check if the items are valid
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order must contain items' });  // If no items, return an error
  }

  try {
    let totalAmount = 0;  // Start with totalAmount as 0

    // Loop through each item in the order
    for (const item of items) {
      // Get the menu item from the database using its ID
      const menuItem = await Menu.findById(item.menuItem);  
      
      // If the menu item is not found, return an error
      if (!menuItem) return res.status(404).json({ message: `Menu item not found: ${item.menuItem}` });

      // Add the price of the item multiplied by the quantity to the total amount
      totalAmount += menuItem.price * item.quantity;
    }
    // console.log(req.user._id) ;
    // Create the order in the database with the user's ID, the items, and the total amount
    const order = await Order.create({
      userId: req.user._id,  // The ID of the user placing the order
      items,  // The items in the order
      totalAmount,  // The total cost of the order
    });

    // Return the created order with a success status
    res.status(201).json(order);

  } catch (err) {
    // Catch any server errors and send an error message
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Function to get all orders of the logged-in user
exports.getOrders = async (req, res) => {
  try {
    // Fetch the orders from the database where the userId matches the logged-in user
    const orders = await Order.find({ userId: req.user._id }).populate('items.menuItem');

    // Send back the orders as a response
    res.json(orders);
  } catch (err) {
    // Catch any server errors and send an error message
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
