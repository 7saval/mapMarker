// express 모듈 셋팅
const express = require('express');
const router = express.Router();                        // 해당 파일을 express 라우터로 사용 가능
const pool = require('../database/connect/mariadb');     // db pool 셋팅
const {allGroups, setGroup, removeGroup} = require('../controller/GroupController');
router.use(express.json()) // http 외 모듈 'json'

// 그룹 조회 
router.route('/')
    .get(allGroups)
    // 그룹 생성
    .post(setGroup)

// 그룹 삭제
router.route('/:id')
    .delete(removeGroup)



module.exports = router;