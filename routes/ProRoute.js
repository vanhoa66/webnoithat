const express = require("express"),
    router = express.Router(),
    Menu = require("../models/menuModel"),
    Product = require("../models/productModel"),
    slug = require("slug");

router.route("/")
    .get((req, res) => {
        Product.find()
            .then(products => {
                Menu.find()
                    .then(menus => res.render("index", { menus, products }))
            })
            .catch(e => console.log(e))
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
    .get((req, res) => {
        Menu.find()
            .then(menus => res.render("proAdd", { menus }))
            .catch(e => console.log(e))
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
    .get((req, res) => {
        let slugPro = req.params.slugPro;
        Product.findOne({ slugPro })
            .then(product => {
                Menu.find()
                    .then(menus => res.render("proDetail", { menus, product }))
            })
            .catch(e => console.log(e))
    });

router.route("/menu/:slugMenu")
    .get((req, res) => {
        let slugMenu = req.params.slugMenu;
        let page = 1;
        Menu.findOne({ slugMenu })
            .then(menu => {
                Menu.find()
                    .then(menus => {
                        Product.find({ 'menu.id': menu.id }).count()
                            .then(totalPro => {
                                let totalPage = Math.ceil(totalPro / 3);
                                Product.find({ 'menu.id': menu.id }).skip((page - 1) * 3).limit(3)
                                    .then(products => {
                                        res.render("menuPro", { menu, menus, products, totalPage, page })
                                    })
                            })
                    })
            })
    });

router.route("/menu/:slugMenu/:page")
    .get((req, res) => {
        let slugMenu = req.params.slugMenu;
        let queryPage = req.params.page;
        let page = parseInt(queryPage, 10);
        page = page ? page : 1;
        Menu.findOne({ slugMenu })
            .then(menu => {
                Menu.find()
                    .then(menus => {
                        Product.find({ 'menu.id': menu.id }).count()
                            .then(totalPro => {
                                let totalPage = Math.ceil(totalPro / 3);
                                Product.find({ 'menu.id': menu.id }).skip((page - 1) * 3).limit(3)
                                    .then(products => {
                                        res.render("menuPro", { menu, menus, products, totalPage, page })
                                    })
                            })
                    })
            })
            .catch(e => console.log(e))
    });

router.route("/product/:id/edit")
    .get((req, res) => {
        let idPro = req.params.id;
        Product.findById(idPro)
            .then(product => {
                Menu.find()
                    .then(menus => res.render("proEdit", { menus, product }))
            })
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
