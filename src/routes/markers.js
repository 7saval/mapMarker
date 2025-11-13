// express 모듈 셋팅
const express = require('express');
const router = express.Router();                        // 해당 파일을 express 라우터로 사용 가능
// const pool = require('../database/connect/mariadb');     // db pool 셋팅
const {allMarkers, setMarker, updateMarker, removeMarker} = require('../controller/MarkerController');
router.use(express.json()) // http 외 모듈 'json'

// 마커 조회 
router.route('/')
    .get(allMarkers)
// 마커 생성
    .post(setMarker)

// 마커 수정
router.route('/:id')
    .put(updateMarker)
// 마커 삭제
    .delete(removeMarker)


module.exports = router;