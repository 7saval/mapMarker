// express 서버 구현
// express 모듈 가져오기
const express = require('express');
const app = express();  // app 객체 생성
const port = 3001       // port 셋팅
const pool = require('./database/connect/mariadb')  // db pool 셋팅

// 지정한 포트로 서버 실행
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// 미들웨어 셋팅
// express.static 미들웨어를 사용하여 'index.html'과 같은 정적 파일을 서비스합니다.
// __dirname은 현재 실행 중인 스크립트(app.js)가 있는 디렉터리를 가리킵니다.
app.use(express.static(__dirname));
app.use(express.json())

// 라우팅
// 마커 조회 
app.get('/markers', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        let rows = await conn.query("SELECT * FROM markers")
        res.json(rows)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally { 
      if (conn) conn.release(); // 또는 conn.end() 대신 conn.release()를 사용하여 커넥션을 풀에 반환
    }
})

// 마커 생성
app.post('/markers', async (req, res) => {
    const {name, lat, lng} = req.body
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query(
            "INSERT INTO markers (name, lat, lng) VALUES (?, ?, ?)",
            [name, parseFloat(lat), parseFloat(lng)]
        )
        // const [warnings] = await conn.query("SHOW WARNINGS");
        // console.log(warnings);
        res.json({
            success : true,
            id: Number(result.insertId)
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Internal Server Error'
        })
    } finally {
        if (conn) conn.release();
    }
})