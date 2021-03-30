const express = require('express');
// const multer = require('multer');

const { User, Book } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => { // 모든 라우터에 회원정보 넣어주기 위함
    res.locals.user = req.user;
    next();
});

router.get('/', async (req, res, next) => {
    try {
        const books = await Book.findAll({ where: { SoldId: null } }); // 낙찰되지 않은 상품들만 보여줌(누군가 낙찰 받았으면 안보여주기)
        res.render('index.html', {
            books,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('login.html');
});

router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('signup.html');
});

// 0330 책 등록
router.post('/book', isLoggedIn, async (req, res, next) => {
    try {
        const { title, price } = req.body;
        console.log(price);
        console.log("title", title);
        const book = await Book.create({
            OwnerId: req.user.id,
            title: title,
            // img: req.file.filename,
            price: price,
        });
        res.send(`<script type="text/javascript">alert("책 등록 완료"); location.href="/";</script>`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0327 판매 게시판, 판매 게시물 등록
router.get('/saleDetail', isNotLoggedIn, (req, res) => {
    res.render('saleDetail.html');
});
router.get('/saleBoard', isNotLoggedIn, (req, res) => {
    res.render('saleBoard.html');
});

router.get('/mypage', isLoggedIn, (req, res) => {
    res.render('myPage.html');
});

module.exports = router;