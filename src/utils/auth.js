const jwt = require('jsonwebtoken');    // jwt 모듈
const pool = require('../database/connect/mariadb');     // db pool 셋팅

const verifyUser = async (req) => {
    const token = req.cookies?.token;
    if(!token) return null;
    
    try{
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        // 토큰의 이메일로 DB에서 사용자 조회
        let conn;
        conn = await pool.getConnection();
        const sql = 'SELECT user_id, email, user_name FROM users WHERE email = ?';
        const rows = await conn.query(sql, decoded.email);
        const userRow = rows[0];
        conn.release();

        return userRow || null;
    }catch(err){
        console.error("verifyUser error: ", err);
        return null;
    }
};

module.exports = {
    verifyUser
};