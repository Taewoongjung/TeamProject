const express = require('express');
const sequelize = require("sequelize");
const Op = sequelize.Op;

const { User, Book, Who, Post, Community } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => { // 모든 라우터에 회원정보 넣어주기
    res.locals.user = req.user;
    next();
});

// 구매하기 댓글에 구매완료 적용
router.post('/commentTrade_sale', isLoggedIn, async (req, res, next) => {
    const { bookId, UserId } = req.body;
    const theBook = await Book.findOne({
        where:{
            id: bookId,
        }
    });
    console.log("책 아이디 = ", bookId);
    console.log("책 유저 아이디 = ", UserId);

    const theComment = await Post.findOne({
        where:{
            UserId: UserId,
        }
    });
    console.log("댓글 유저 아이디 = ", theComment.id);
    console.log("댓글 유저 닉네임 = ", theComment.commentingNick);

    if (req.user.id === theBook.OwnerId) {
        console.log("통과");
        if ( req.user.id !== theComment.UserId ) {
            await Book.update({  // 거래 완료. 거래 완료 되면 화면에 뿌려주는 아이템들의 조건들이 다 바뀔 예정
                sold: 1,
                SoldId: UserId,
            }, {
                where: { id: theBook.id},
            });                             // 거래 완료되면 판매내역으로 이동할지 조원들과 회의
            // return res.send(`<script type="text/javascript">alert("거래 완료!"); location.href="/book/${bookId}";</script>`);
            return res.send(`<script type="text/javascript">alert("거래 완료!"); location.href="/tradeHistory";</script>`);
        } else {
            return res.send(`<script type="text/javascript">alert("잘못된 접근 입니다.(자신한테 거래)"); location.href="/book/${bookId}";</script>`);
        }
    } else {
        return res.send(`<script type="text/javascript">alert("판매자가 아닙니다."); location.href="/book/${bookId}";</script>`);
    }
});

// 구매하기 답글에 구매완료 적용
router.post('/reCommentTrade_sale', isLoggedIn, async (req, res, next) => {
    const { re_bookId, recomment_UserId } = req.body;
    const theBook = await Book.findOne({
        where:{
            id: re_bookId,
        }
    });
    console.log("책 아이디 = ", re_bookId);
    console.log("책 유저 아이디 = ", recomment_UserId);

    const theComment = await Post.findOne({
        where:{
            UserId: recomment_UserId,
        }
    });
    console.log("댓글 유저 아이디 = ", theComment.id);
    console.log("댓글 유저 닉네임 = ", theComment.commentingNick);

    if (req.user.id === theBook.OwnerId) {
        console.log("통과");
        if ( req.user.id !== theComment.UserId ) {
            await Book.update({  // 거래 완료. 거래 완료 되면 화면에 뿌려주는 아이템들의 조건들이 다 바뀔 예정
                sold: 1,
                SoldId: recomment_UserId,
            }, {
                where: { id: theBook.id},
            });                            
            // return res.send(`<script type="text/javascript">alert("거래 완료!"); location.href="/book/${re_bookId}";</script>`);
            return res.send(`<script type="text/javascript">alert("거래 완료!"); location.href="/tradeHistory";</script>`);
        } else {
            return res.send(`<script type="text/javascript">alert("잘못된 접근 입니다.(자신한테 거래)"); location.href="/book/${re_bookId}";</script>`);
        }
    } else {
        return res.send(`<script type="text/javascript">alert("판매자가 아닙니다."); location.href="/book/${re_bookId}";</script>`);
    }
});

// 삽니다 댓글에 구매완료 적용
router.post('/commentTrade_buy', isLoggedIn, async (req, res, next) => {
    const { bookId, UserId } = req.body;
    const theBook = await Book.findOne({
        where:{
            id: bookId,
        }
    });
    console.log("책 아이디 = ", bookId);
    console.log("책 유저 아이디 = ", UserId);

    const theComment = await Post.findOne({
        where:{
            UserId: UserId,
        }
    });
    console.log("댓글 유저 아이디 = ", theComment.id);
    console.log("댓글 유저 닉네임 = ", theComment.commentingNick);

    if (req.user.id === theBook.OwnerId) {
        console.log("통과");
        if ( req.user.id !== theComment.UserId ) {
            await Book.update({  // 거래 완료. 거래 완료 되면 화면에 뿌려주는 아이템들의 조건들이 다 바뀔 예정
                sold: 1,
                SoldId: UserId,
            }, {
                where: { id: theBook.id},
            });                             // 거래 완료되면 판매내역으로 이동할지 조원들과 회의
            // return res.send(`<script type="text/javascript">alert("거래 완료!"); location.href="/wannabuy/buybook/${bookId}";</script>`);
            return res.send(`<script type="text/javascript">alert("거래 완료!"); location.href="/tradeHistory";</script>`);
        } else {
            return res.send(`<script type="text/javascript">alert("잘못된 접근 입니다.(자신한테 거래)"); location.href="/wannabuy/buybook/${bookId}";</script>`);
        }
    } else {
        return res.send(`<script type="text/javascript">alert("판매자가 아닙니다."); location.href="/wannabuy/buybook/${bookId}";</script>`);
    }
});

// 삽니다 답글에 구매완료 적용
router.post('/reCommentTrade_buy', isLoggedIn, async (req, res, next) => {
    const { re_bookId, recomment_UserId } = req.body;
    const theBook = await Book.findOne({
        where:{
            id: re_bookId,
        }
    });
    console.log("책 아이디 = ", re_bookId);
    console.log("책 유저 아이디 = ", recomment_UserId);

    const theComment = await Post.findOne({
        where:{
            UserId: recomment_UserId,
        }
    });
    console.log("댓글 유저 아이디 = ", theComment.id);
    console.log("댓글 유저 닉네임 = ", theComment.commentingNick);

    if (req.user.id === theBook.OwnerId) {
        console.log("통과");
        if ( req.user.id !== theComment.UserId ) {
            await Book.update({  // 거래 완료. 거래 완료 되면 화면에 뿌려주는 아이템들의 조건들이 다 바뀔 예정
                sold: 1,
                SoldId: recomment_UserId,
            }, {
                where: { id: theBook.id},
            });                             // 거래 완료되면 판매내역으로 이동할지 조원들과 회의
            // return res.send(`<script type="text/javascript">alert("거래 완료!"); location.href="/wannabuy/buybook/${re_bookId}";</script>`);
            return res.send(`<script type="text/javascript">alert("거래 완료!"); location.href="/tradeHistory";</script>`);
        } else {
            return res.send(`<script type="text/javascript">alert("잘못된 접근 입니다.(자신한테 거래)"); location.href="/wannabuy/buybook/${re_bookId}";</script>`);
        }
    } else {
        return res.send(`<script type="text/javascript">alert("판매자가 아닙니다."); location.href="/wannabuy/buybook/${re_bookId}";</script>`);
    }
});

module.exports = router;