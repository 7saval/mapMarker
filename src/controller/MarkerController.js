const { verify } = require('jsonwebtoken');
const pool = require('../database/connect/mariadb');     // db pool 셋팅
const {StatusCodes} = require('http-status-codes');    // status code 모듈
const { verifyUser } = require('../utils/auth');

// 전체 마커 조회 
const allMarkers = async (req, res) => {
    let conn;
    try {
        const user = await verifyUser(req);

        if(!user) return res.status(StatusCodes.UNAUTHORIZED).json({
            message: '로그인이 필요합니다.'
        })

        conn = await pool.getConnection();
        let sql = `SELECT m.id			AS id,
                        m.grp_id		AS grp_id,
                        g.grp_name		AS grp_name,
                        m.name			AS name,
                        m.description   AS description,
                        m.lat			AS lat,
                        m.lng			AS lng,
                        m.created_at	AS created_at,
                        g.user_id		AS user_id 
					FROM markers m
               LEFT JOIN groups g ON (g.grp_id = m.grp_id)
				   WHERE g.user_id = ?`;
        const rows = await conn.query(sql, user.user_id);
        if(!rows[0]) return;
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    } finally { 
    if (conn) conn.release(); // 또는 conn.end() 대신 conn.release()를 사용하여 커넥션을 풀에 반환
    }
}

// 마커 생성
const setMarker = async (req, res) => {
    const {name, lat, lng, grp_id} = req.body;
    let conn;
    try {
        const user = await verifyUser(req);

        if(!user) return res.status(StatusCodes.UNAUTHORIZED).json({
            message: '로그인이 필요합니다.'
        })

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
        const user = await verifyUser(req);

        if(!user) return res.status(StatusCodes.UNAUTHORIZED).json({
            message: '로그인이 필요합니다.'
        });

        conn = await pool.getConnection();
        let sql = "UPDATE markers SET name = ?, grp_id = ? WHERE id = ? AND user_id = ?";
        let values = [name, grp_id, id, user.user_id];
        const result = await conn.query(sql, values);
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
        const user = await verifyUser(req);

        if(!user) return res.status(StatusCodes.UNAUTHORIZED).json({
            message: '로그인이 필요합니다.'
        });

        conn = await pool.getConnection();
        let sql = "DELETE FROM markers WHERE id = ? AND user_id = ?";
        let values = [id, user.user_id];
        const result = await conn.query(sql, values);
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