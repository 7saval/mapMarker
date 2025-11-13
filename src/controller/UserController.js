const pool = require('../database/connect/mariadb');     // db pool 셋팅
const {StatusCodes} = require('http-status-codes');    // status code 모듈
const { verifyUser } = require('../utils/auth');    // 로그인 인증
const jwt = require('jsonwebtoken');    // jwt 모듈
const crypto = require('crypto');    // crypto 모듈
const dotenv = require('dotenv');   // dotenv 모듈
dotenv.config();

// 회원가입
const join = async (req, res) => {
    const {email, password, userName} = req.body;
    let conn;
    try {
        conn = await pool.getConnection();
        let sql = `INSERT INTO users (email, password, user_name, salt) VALUES (?, ?, ?, ?)`;

        let user_id;

        // 비밀번호 암호화
        const salt = crypto.randomBytes(64).toString('base64'); // 무작위 문자열
        const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64'); // 해싱

        let values = [email, hashPassword, userName, salt];
        const result = await conn.query(sql, values);
        
        user_id = Number(result.insertId);

        // 내 장소 그룹 추가
        sql = `INSERT INTO groups (grp_name, user_id) VALUES ('내 장소', ?)`;
        const result2 = await conn.query(sql, user_id);

        res.status(StatusCodes.CREATED).json({
            success : true,
            message : "회원가입에 성공했습니다.",
            // id: Number(result.insertId)
        })
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Internal Server Error'
        })
    } finally {
        if (conn) conn.release();
    }
}

// 로그인
const login = async (req, res) => {
    const {email, password} = req.body
    let conn;
    try {
        conn = await pool.getConnection();
        let sql = `SELECT * FROM users WHERE email= ?`;
        const results = await conn.query(sql, email)
        
        var loginInfo = results[0];

        // salt값 꺼내서 날 것의 비밀번호 암호화
        const hashPassword = crypto.pbkdf2Sync(password, loginInfo.salt, 10000, 10, 'sha512').toString('base64');
        
        // 해시된 DB 비밀번호랑 비교
        if(loginInfo?.password === hashPassword){
            // token 발급 - 유효기간 설정
            const token = jwt.sign({
                email : loginInfo.email
            }, process.env.PRIVATE_KEY, {
                expiresIn : '30m',  // 유효기간
                issuer : 'kyj'      // 발행인
            })

            // 쿠키에 토큰 담기 - 토큰 변수에 토큰 담기
            res.cookie("token", token, {
                httpOnly : true
            });
            console.log(token);
            res.status(StatusCodes.OK).json({
                success : true,
                message : "로그인에 성공했습니다."
            });
        }else{
            res.status(StatusCodes.UNAUTHORIZED).json({
                success : false,
                message : "아이디 또는 비밀번호가 일치하지 않습니다."
            })
        }        
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Internal Server Error'
        })
    } finally {
        if (conn) conn.release();
    }
}

// 로그인 상태인지 확인하는 인증 체크
const check = async (req, res) => {
    const user = await verifyUser(req); // DB에 user있는지 확인

    if(user){
        // db에 user 있으면 res OK 응답 전달
        return res.status(StatusCodes.OK).json({ 
            success: true, 
            authenticated: true,
            email: user.email,
            userName: user.user_name
        });
    }else{
        return res.status(StatusCodes.OK).json({ 
            success: false, 
            authenticated: false
        });
    }
}

// 로그아웃
const logout = async (req, res) => {
    res.clearCookie('token');
    return res.status(StatusCodes.OK).json({ success: true, message: '로그아웃 되었습니다.' });
}

module.exports = {
    login,
    join,
    check,
    logout
}