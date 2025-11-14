// express 모듈 셋팅
const express = require('express');
const router = express.Router();                        // 해당 파일을 express 라우터로 사용 가능
const {body, validationResult} = require('express-validator');       // 유효성 검사 모듈
const {StatusCodes} = require('http-status-codes');    // status code 모듈
const {
    join, 
    login,
    check, 
    logout} = require('../controller/UserController');

router.use(express.json()) // http 외 모듈 'json'
// 유효성검사 미들웨어 분리
const validate = (req, res, next) => {
    const err = validationResult(req);

    if(err.isEmpty()){
        return next();  // 다음 할 일(미들웨어, 함수)로 보내기
    }
    else{
        return res.status(StatusCodes.BAD_REQUEST).json(err.array());
    }
}

// 회원가입
router.post('/join',
    [
        body('email')
            .notEmpty().withMessage('이메일을 입력해주세요.')
            .bail()  // 첫 번째 실패 시 다음 검증 중단
            .isEmail().withMessage('올바른 이메일 형식을 입력해주세요.'),
        body('password')
            .notEmpty().withMessage('비밀번호를 입력해주세요.')
            .bail()
            .isString().withMessage('비밀번호는 문자열이어야 합니다.'),
        body('userName')
            .notEmpty().withMessage('이름을 입력해주세요.')
            .bail()
            .isString().withMessage('이름은 문자열이어야 합니다.'),
        validate
    ],
     join);

// 로그인
router.post('/login', 
    [
        body('email')
            .notEmpty().withMessage('이메일을 입력해주세요.')
            .bail()  // 첫 번째 실패 시 다음 검증 중단
            .isEmail().withMessage('올바른 이메일 형식을 입력해주세요.'),
        body('password')
            .notEmpty().withMessage('비밀번호를 입력해주세요.')
            .bail()
            .isString().withMessage('비밀번호는 문자열이어야 합니다.'),
        validate
    ],
    login);

// 인증 체크
router.get('/check', check);

// 로그아웃
router.post('/logout', logout);



module.exports = router;