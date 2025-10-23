// express 서버 구현
// express 모듈 가져오기
const express = require('express');
const app = express();  // app 객체 생성
const path = require('path');
const {StatusCodes} = require('http-status-codes');

// dotenv 모듈
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 3001;       // port 셋팅 (기본값 3001)

// 지정한 포트로 서버 실행
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// 미들웨어 셋팅
// express.static 미들웨어를 사용하여 'index.html'과 같은 정적 파일을 서비스합니다.
// __dirname은 현재 실행 중인 스크립트(app.js)가 있는 디렉터리를 가리킵니다.
// app.use(express.static(__dirname));
// 정적 파일 제공: index.html은 직접 치환해서 제공할 것이므로 auto index 제공을 비활성화합니다.
app.use(express.static(path.join(__dirname, 'public'), { index: false }));
app.use(express.json())

const fs = require('fs');

// 루트 요청 시 public/index.html의 플레이스홀더를 실제 env 값으로 치환해서 전달
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(indexPath, 'utf8', (err, data) => {
        if (err) {
            console.error('index.html 파일을 읽을 수 없습니다.', err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('서버 오류');
        }

        const appKey = process.env.MAP_APP_KEY || '';
        const replaced = data.replace(/%MAP_APP_KEY%/g, appKey);
        res.send(replaced);
    });
});

// url과 정적 파일 매핑
// /login get 요청 시 login.html 파일 전달
app.get('/login',(req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
})

// /join get 요청 시 join.html 파일 전달
app.get('/join',(req, res)=>{
    res.sendFile(path.join(__dirname, 'public/join.html'));
})

// 라우팅
const userRouter = require('./routes/users');         // 회원
const markerRouter = require('./routes/markers');     // 마커
const groupRouter = require('./routes/groups');       // 그룹

app.use("/users", userRouter);
app.use("/markers", markerRouter);
app.use("/groups", groupRouter);