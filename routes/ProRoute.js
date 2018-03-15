const express = require("express"),
    router = express.Router(),
    Menu = require("../models/menuModel"),
    Product = require("../models/productModel"),
    slug = require("slug");

let menus = [];
Menu.find()
    .then(arrMenu => menus = arrMenu )
    .catch(e => console.log(e))

router.route("/")
    .get(async (req, res) => {
        // let r = await foo();
        // console.log(r);
        // menus.forEach(e => {
        //     Product.find({'menu.id': e.id}).then(r => {pro.push(r); console.log(pro);});
        // }) 

        Product.find()
            .then(products => {
                res.render("index", { menus, products })
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
    .get((req, res) => {
        let slugPro = req.params.slugPro;
        Product.findOne({ slugPro })
            .then(product => {
                res.render("proDetail", { menus, product })
            })
            .catch(e => console.log(e))
    });

router.route("/menu/:slugMenu")
    .get((req, res) => {
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
    .get((req, res) => {
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
    .get((req, res) => {
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
