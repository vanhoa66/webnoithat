const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
    name: String,
    slugPro: {
        type: String,
        unique: true
    },
    date: { type: Date, default: Date.now },
    price: Number,
    image: String,
    description: String,
    menu: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Menu"
        },
        slugMenu: String
    },

})

const Product = mongoose.model("Product", productSchema);

module.exports = Product;