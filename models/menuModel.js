const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
    name: String,
    slugMenu: {
        type: String,
        unique: true
    }
})

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;