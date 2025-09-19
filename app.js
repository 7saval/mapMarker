// express 서버 구현
// express 모듈 가져오기
const express = require('express');
const app = express();  // app 객체 생성
const port = 3001       // port 셋팅

// 지정한 포트로 서버 실행
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// 미들웨어 셋팅
app.use(express.json())

// 라우팅
// REST API : 조회 
app.get('/', (req, res) => {
    res.send('Hello World!')
})