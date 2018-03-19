const Menu = require("../models/menuModel");

module.exports = async () => {
    let menus = [];
    try {
        menus = await Menu.find().then();
    } catch (e) {
        console.log(e)
    }
    return menus;
}
