
const express = require("express"),
    router = express.Router(),
    Menu = require("../models/menuModel"),
    Product = require("../models/productModel"),
    getMenu = require("./menuRoute"),
    slug = require("slug");

router.route("/")
    .get(async (req, res) => {
        // Promise.all([Menu.find().then(), Product.find().then()])
        //     .then(data => {

        let menus, products = [];
        try {
            menus = await Menu.find().then();
            for (let i = 0; i < menus.length; i++) {
                let p = await Product.find({ 'menu.id': menus[i].id }).limit(4).then();
                products = products.concat(p);
            }
        } catch (e) {
            console.log(e)
        }
        res.render("index", { menus, products })
    })
    .post((req, res) => {
        let { name } = req.body;
        let slugMenu = slug(name, { lower: true });
        let newMenu = { name, slugMenu };
        Menu.create(newMenu)
            .then(() => res.redirect("/"))
            .catch(e => res.redirect("/"))
    });

router.route("/proAdd")
    .get(async (req, res) => {
        let menus = await getMenu();
        res.render("proAdd", { menus })
    })
    .post((req, res) => {
        let { name, price, image } = req.body;
        let idMenu = req.body.menu;
        let description = req.body.editor1;
        Menu.findById(idMenu)
            .then(menuResult => {
                let menuPro = {
                    id: menuResult._id,
                    slugMenu: menuResult.slugMenu
                };
                let slugPro = slug(name, { lower: true });
                let newPro = { menu: menuPro, name, slugPro, price, image, description };
                Product.create(newPro)
                    .then(() => res.redirect("/"))
                    .catch(e => res.redirect("back"))
            })
            .catch(e => res.redirect("back"))
    });

router.route("/product/:slugPro")
    .get(async (req, res) => {
        let menus = await getMenu();
        let slugPro = req.params.slugPro;
        Product.findOne({ slugPro })
            .then(product => {
                res.render("proDetail", { menus, product })
            })
            .catch(e => console.log(e))
    });

router.route("/menu/:slugMenu")
    .get(async (req, res) => {
        let menus = await getMenu();
        let slugMenu = req.params.slugMenu;
        let queryPage = req.params.page;
        let page = 1;
        Menu.findOne({ slugMenu })
            .then(menu => {
                Product.find({ 'menu.id': menu.id }).count()
                    .then(totalPro => {
                        let totalPage = Math.ceil(totalPro / 3);
                        Product.find({ 'menu.id': menu.id }).skip((page - 1) * 3).limit(3)
                            .then(products => {
                                res.render("menuPro", { menu, menus, products, totalPage, page })
                            })
                    })
            })
    });

router.route("/menu/:slugMenu/:page")
    .get(async (req, res) => {
        let menus = await getMenu();
        let slugMenu = req.params.slugMenu;
        let queryPage = req.params.page;
        let page = parseInt(queryPage, 10);
        page = page ? page : 1;
        Menu.findOne({ slugMenu })
            .then(menu => {
                Product.find({ 'menu.id': menu.id }).count()
                    .then(totalPro => {
                        let totalPage = Math.ceil(totalPro / 3);
                        Product.find({ 'menu.id': menu.id }).skip((page - 1) * 3).limit(3)
                            .then(products => {
                                res.render("menuPro", { menu, menus, products, totalPage, page })
                            })
                    })
            })
            .catch(e => console.log(e))
    });

router.route("/product/:id/edit")
    .get(async (req, res) => {
        let menus = await getMenu();
        let idPro = req.params.id;
        Product.findById(idPro)
            .then(product => res.render("proEdit", { menus, product }))
            .catch(e => console.log(e))
    })

router.route("/product/:id")
    .put((req, res) => {
        let { name, price, image } = req.body;
        let idMenu = req.body.menu;
        let description = req.body.editor1;
        Menu.findById(idMenu)
            .then(menuResult => {
                let menuPro = {
                    id: menuResult._id,
                    menu: menuResult.slugMenu
                };
                let idPro = req.params.id;
                let newPro = { menu: menuPro, name, price, image, description };
                Product.findByIdAndUpdate(idPro, newPro)
                    .then((product) => res.redirect("/product/" + product.slugPro))
            })
            .catch(e => res.redirect("/"))
    })
    .delete((req, res) => {
        let idPro = req.params.id;
        Product.findByIdAndRemove(idPro)
            .then(() => res.redirect("/"))
            .catch(e => res.redirect("/"))
    });

module.exports = router;
