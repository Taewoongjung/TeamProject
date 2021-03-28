const express = require('express');
const passport = require('passport');
const sanitize = require('sanitize-html');
const bcrypt = require('bcrypt');

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.post('/signup', isNotLoggedIn, async (req, res, next) => {
    const { name, phone, nick, email, password, answer, re_password, question } = req.body;
    try {
        const exUser = await User.findOne({ where: { email: email } });
        if (exUser) {
            return res.send(`<script type="text/javascript">alert("이미 가입된 이메일입니다."); location.href="/signup/";</script>`);
        }
        else if (password !== re_password) {
            return res.send(`<script type="text/javascript">alert("비밀번호가 맞지 않습니다."); location.href="/signup/";</script>`);
        }
        sanitize(password);
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            name,
            phone,
            nick,
            email,
            password: hash,
            question,
            answer,
        });
        return res.send(`<script type="text/javascript">alert("회원가입을 완료했습니다."); location.href="/signup/";</script>`);
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            return res.send(`<script type="text/javascript">alert("${info.message}"); location.href="/login/";</script>`);
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

router.post('/ID', async (req, res, next) => {
    const { phone } = req.body;
    try {
        const FindUser = await User.findOne({ where: { phone: phone } });
        if (FindUser) {
            return res.send(`<script type="text/javascript">alert("아이디는 ${FindUser.email} 입니다."); location.href="/login";</script>`);
        } else {
            return res.send(`<script type="text/javascript">alert("회원이 존재하지 않습니다."); location.href="/pages/findID";</script>`);
        } 
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

router.post('/PW_fir', async (req, res) => {
    const { name } = req.body;
    try {
        const FindUser = await User.findOne({ where: { name: name } });
        if (FindUser) {
            // console.log(FindUser);
            return res.render('findPW.html', { user: FindUser, question : FindUser.question });
        } else {
            return res.send(`<script type="text/javascript">alert("회원이 존재하지 않습니다."); location.href="/pages/findPW";</script>`);
        }
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

router.post('/PW_sec', async (req, res) => {
    const { name } = req.body;
    try {
        const FindUser = await User.findOne({ where: { name: name } });
        if (FindUser) {
            return res.render('findPW.html,', { question : FindUser.email});
        } else {
            return res.send(`<script type="text/javascript">alert("다시 입력 해주세요"); location.href="/pages/findPW";</script>`);
        }
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',  // kakao 로그인 실패
}), (req, res) => {
  res.redirect('/');  // kakao 로그인 성공
});

module.exports = router;