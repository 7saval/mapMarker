// express 모듈 셋팅
const express = require('express');
const router = express.Router();                        // 해당 파일을 express 라우터로 사용 가능
// const pool = require('../database/connect/mariadb');     // db pool 셋팅
const {
    join, 
    login} = require('../controller/UserController');

router.use(express.json()) // http 외 모듈 'json'

// 회원가입
router.post('/join', join);

// 로그인
router.post('/login', login);



module.exports = router;