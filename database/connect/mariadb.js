// DB 연동
const mariadb = require('mariadb');

// 연결 풀 만들기
const pool = mariadb.createPool({
    host: 'localhost',
    port: 3307,
    user: 'devuser',
    password: '1234',
    database: 'MAPMARKER',
    charset: 'utf8mb4',
    connectionLimit: 10
})

// 연결 테스트 함수
async function testConnection() {
    try {
        console.log('Testing database connection...');
        const connection = await pool.getConnection();
        console.log('Database connection successful!');
        const [rows] = await connection.query('SELECT 1 as test');
        console.log('Test query result:', rows);
        connection.release();
    } catch (err) {
        console.error('Database connection failed:', err);
    }
}

// 연결 테스트 실행
testConnection();

// 모듈 외부에서 사용 가능하도록 export
module.export = pool;