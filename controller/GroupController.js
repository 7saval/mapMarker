const pool = require('../database/connect/mariadb');     // db pool 셋팅
const {StatusCodes} = require('http-status-codes');    // status code 모듈

// 그룹 전체 조회
const allGroups = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        let rows = await conn.query("SELECT * FROM groups")
        res.json(rows)
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    } finally { 
    if (conn) conn.release(); // 또는 conn.end() 대신 conn.release()를 사용하여 커넥션을 풀에 반환
    }
}

// 그룹 생성
const setGroup = async (req, res) => {
    const {grpName} = req.body
    let conn;
    try {
        conn = await pool.getConnection();
        let sql = "INSERT INTO groups (grp_name) VALUES (?)";
        let values = [grpName];
        const result = await conn.query(sql, values)
        // const [warnings] = await conn.query("SHOW WARNINGS");
        // console.log(warnings);
        res.json({
            success : true,
            id: Number(result.insertId)
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

// 그룹 삭제
const removeGroup = async (req,res)=>{
    let {id}= req.params;
    id = parseInt(id);
    let conn;
    try {
        conn = await pool.getConnection();
        let sql = "DELETE FROM groups WHERE grp_id = ?";
        const result = await conn.query(sql, id)
        console.log(result)
        res.json({
            success : true
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

module.exports = {
    allGroups,
    setGroup,
    removeGroup
};