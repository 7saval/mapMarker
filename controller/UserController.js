const pool = require('../database/connect/mariadb');     // db pool 셋팅
const {StatusCodes} = require('http-status-codes');    // status code 모듈
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
        let sql = "INSERT INTO users (email, password, user_name) VALUES (?, ?, ?)";
        let values = [email, password, userName];
        const result = await conn.query(sql, values)
        // const [warnings] = await conn.query("SHOW WARNINGS");
        // console.log(warnings);
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

        res.status(StatusCodes.OK).json(loginInfo);
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Internal Server Error'
        })
    } finally {
        if (conn) conn.release();
    }
}

module.exports = {
    login,
    join
}