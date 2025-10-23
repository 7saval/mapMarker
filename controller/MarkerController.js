const pool = require('../database/connect/mariadb');     // db pool 셋팅
const {StatusCodes} = require('http-status-codes');    // status code 모듈

// 전체 마커 조회 
const allMarkers = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        let rows = await conn.query("SELECT * FROM markers")
        res.json(rows)
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    } finally { 
    if (conn) conn.release(); // 또는 conn.end() 대신 conn.release()를 사용하여 커넥션을 풀에 반환
    }
}

// 마커 생성
const setMarker = async (req, res) => {
    const {name, lat, lng, grp_id} = req.body
    let conn;
    try {
        conn = await pool.getConnection();
        let sql = "INSERT INTO markers (name, lat, lng, grp_id) VALUES (?, ?, ?, ?)";
        let values = [name, parseFloat(lat), parseFloat(lng), grp_id];
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

// 마커 수정
const updateMarker = async (req,res)=>{
    let {id}= req.params;
    id = parseInt(id);
    let {name, grp_id} = req.body;

    let conn;
    try {
        conn = await pool.getConnection();
        let sql = "UPDATE markers SET name = ?, grp_id = ? WHERE id = ?";
        let values = [name, grp_id, id];
        const result = await conn.query(sql, values)
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

// 마커 삭제
const removeMarker = async (req,res)=>{
    let {id}= req.params;
    id = parseInt(id);
    let conn;
    try {
        conn = await pool.getConnection();
        let sql = "DELETE FROM markers WHERE id = ?";
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
    allMarkers,
    setMarker,
    updateMarker,
    removeMarker
};