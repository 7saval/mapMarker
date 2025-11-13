# 카카오맵 마커 관리 프로젝트 개요

### **1. 프로젝트 개요**

#### **1.1. 프로젝트 설명**
본 프로젝트는 카카오맵 API를 활용하여 지도 위에 사용자가 직접 마커(Marker)를 생성, 조회, 수정, 삭제(CRUD)할 수 있는 웹 애플리케이션을 개발하는 것을 목표로 합니다. Node.js/Express로 백엔드 서버를 구축하고 MariaDB에 데이터를 영구적으로 저장하여, 사용자의 마커 정보를 관리합니다. 사용자 인증 기능을 통해 개인별 마커를 관리하고, 그룹 기능을 통해 마커를 카테고리별로 분류할 수 있습니다.

#### **1.2. 개발 환경**
- **운영체제:** Windows, macOS, Linux 등 무관
- **런타임:** Node.js 18.x 이상
- **데이터베이스:** MariaDB 10.x 이상
- **코드 에디터:** Visual Studio Code (권장)
- **API:** Kakao Maps API

#### **1.3. 기술 스택**
- **Frontend:** HTML5, CSS3, JavaScript (ES6+), Bootstrap 5.3.8
- **Backend:** Node.js, Express.js 5.1.0
- **Database:** MariaDB 3.4.5
- **Library:** 
  - Kakao Maps API (Web)
  - jsonwebtoken 9.0.2 (JWT 인증)
  - cookie-parser 1.4.7 (쿠키 관리)
  - dotenv 17.2.3 (환경 변수 관리)
  - http-status-codes 2.3.0 (HTTP 상태 코드)

### **2. 요구사항 정의**

#### **2.1. 기능적 요구사항**
- **사용자 인증:**
  - 사용자는 회원가입을 통해 계정을 생성할 수 있다.
  - 사용자는 이메일과 비밀번호로 로그인할 수 있다.
  - 로그인한 사용자만 마커 관리 기능을 사용할 수 있다.
  - JWT 토큰 기반 인증을 사용한다.
- **마커 관리 (CRUD):**
  - **R (Read):** 사용자는 자신이 생성한 모든 마커를 지도 위에서 조회할 수 있다.
  - **C (Create):** 사용자는 지도를 클릭하여 원하는 위치에 새로운 마커를 생성하고 이름을 지정할 수 있다.
  - **U (Update):** 사용자는 기존 마커를 클릭하여 마커의 이름과 그룹을 수정할 수 있다.
  - **D (Delete):** 사용자는 기존 마커를 클릭하여 해당 마커를 삭제할 수 있다.
- **그룹 관리:**
  - 사용자는 마커를 그룹으로 분류할 수 있다.
  - 사용자는 그룹을 생성, 조회, 삭제할 수 있다.
  - 회원가입 시 기본 그룹인 "내 장소"가 자동으로 생성된다.
- **부가 기능:** 지도를 축소했을 때, 여러 마커가 겹치면 자동으로 그룹화(Clustering)되어야 한다.

#### **2.2. 비기능적 요구사항**
- **사용성:** 사용자가 직관적으로 기능을 파악하고 사용할 수 있어야 한다.
- **성능:** 페이지 로딩 시, 저장된 마커들이 2초 이내에 지도 위에 표시되어야 한다.
- **보안:** 비밀번호는 암호화되어 저장되며, JWT 토큰을 통한 인증을 사용한다.

### **3. 시스템 설계**

#### **3.1. 시스템 아키텍처 (3-Tier Architecture)**

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (Frontend)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  index.html  │  │  login.html  │  │  join.html   │     │
│  │  (지도 UI)   │  │  (로그인)    │  │  (회원가입)   │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                  │              │
│         └─────────────────┼──────────────────┘              │
│                           │                                 │
│                    fetch API (AJAX)                          │
└───────────────────────────┼─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Server (Backend)                          │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                    app.js                              │ │
│  │  - Express 서버 설정                                  │ │
│  │  - 정적 파일 제공                                      │ │
│  │  - 라우팅 설정                                         │ │
│  └──────────────┬─────────────────────────────────────────┘ │
│                 │                                            │
│  ┌──────────────┼──────────────┐                           │
│  │              │              │                            │
│  ▼              ▼              ▼                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                │
│  │  routes/ │  │  routes/ │  │  routes/ │                │
│  │  users   │  │  markers │  │  groups  │                │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                │
│       │             │              │                        │
│       ▼             ▼              ▼                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                │
│  │controller│  │controller│  │controller│                │
│  │  User    │  │  Marker  │  │  Group   │                │
│  └────┬──────┘  └────┬─────┘  └────┬─────┘                │
│       │             │              │                        │
│       └─────────────┼──────────────┘                        │
│                     │                                        │
│                     ▼                                        │
│            ┌─────────────────┐                               │
│            │   utils/auth.js │                               │
│            │  (JWT 인증)      │                               │
│            └────────┬────────┘                               │
│                     │                                        │
│                     ▼                                        │
│      ┌──────────────────────────────┐                        │
│      │ database/connect/mariadb.js │                        │
│      │   (DB 연결 풀 관리)          │                        │
│      └──────────────┬───────────────┘                        │
└─────────────────────┼────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  Database (MariaDB)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │  users   │  │  markers │  │  groups  │                 │
│  │  테이블  │  │  테이블  │  │  테이블  │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

**아키텍처 설명:**
1. **Client (Frontend):** 웹 브라우저에서 실행되는 HTML 파일들. 사용자의 입력을 받아 상호작용하고, 카카오맵을 렌더링한다. 백엔드 서버와는 `fetch` API를 이용한 비동기 HTTP 통신(AJAX)으로 데이터를 주고받는다.
2. **Server (Backend):** `src/app.js`로 실행되는 Node.js/Express 애플리케이션. 클라이언트의 API 요청을 받아 라우터를 통해 적절한 컨트롤러로 전달하고, 비즈니스 로직을 처리한다. JWT 토큰 기반 인증을 통해 사용자를 검증하고, 데이터베이스에 SQL 쿼리를 전송하여 데이터를 조작한다.
3. **Database (DB):** MariaDB. 사용자 정보, 마커 정보, 그룹 정보를 영구적으로 저장하는 역할을 한다.

#### **3.2. 프로젝트 폴더 구조**

```
mapProject/
├── package.json                    # 프로젝트 의존성 관리
├── package-lock.json               # 의존성 버전 고정
├── README.md                       # 프로젝트 문서
├── PROJECT_DETAIL.md               # 프로젝트 상세 계획서
│
└── src/                            # 소스 코드 디렉토리
    ├── app.js                      # Express 서버 진입점
    ├── .env                        # 환경 변수 (gitignore에 포함)
    │
    ├── controller/                 # 비즈니스 로직 컨트롤러
    │   ├── UserController.js       # 사용자 관련 로직 (회원가입, 로그인, 로그아웃)
    │   ├── MarkerController.js     # 마커 관련 로직 (CRUD)
    │   └── GroupController.js     # 그룹 관련 로직 (생성, 조회, 삭제)
    │
    ├── routes/                     # API 라우팅
    │   ├── users.js                # 사용자 API 라우트
    │   ├── markers.js              # 마커 API 라우트
    │   └── groups.js                # 그룹 API 라우트
    │
    ├── database/                   # 데이터베이스 관련
    │   └── connect/
    │       └── mariadb.js          # MariaDB 연결 풀 설정
    │
    ├── utils/                      # 유틸리티 함수
    │   └── auth.js                 # JWT 인증 미들웨어
    │
    └── public/                     # 정적 파일 (프론트엔드)
        ├── index.html              # 메인 지도 페이지
        ├── login.html              # 로그인 페이지
        ├── join.html               # 회원가입 페이지
        ├── navBar.html             # 네비게이션 바 컴포넌트
        ├── css/
        │   └── style.css           # 스타일시트
        └── js/
            └── nav.js              # 네비게이션 관련 JavaScript
```

#### **3.3. 데이터베이스 설계 (Schema)**
- **DB ERD 설계**
<img width="788" height="500" alt="Image" src="https://github.com/user-attachments/assets/51f9d736-8a06-49c0-b991-11fc0d09e8e9" />

- **Database:** `MAPMARKER`

**users 테이블:**
| Column      | Type             | 제약조건                  | 설명                         |
| :---------- | :--------------- | :------------------------ | :--------------------------- |
| `user_id`   | INT              | PRIMARY KEY, AUTO_INCREMENT | 사용자 고유 식별자 (PK)      |
| `email`     | VARCHAR(255)     | NOT NULL, UNIQUE          | 사용자 이메일 (로그인 ID)    |
| `password`  | VARCHAR(255)     | NOT NULL                  | 암호화된 비밀번호            |
| `user_name` | VARCHAR(100)     | NOT NULL                  | 사용자 이름                  |
| `salt`      | VARCHAR(255)     | NOT NULL                  | 비밀번호 암호화용 솔트        |
| `created_at`| TIMESTAMP        | DEFAULT CURRENT_TIMESTAMP | 레코드 생성 일시             |

**groups 테이블:**
| Column      | Type             | 제약조건                  | 설명                         |
| :---------- | :--------------- | :------------------------ | :--------------------------- |
| `grp_id`    | INT              | PRIMARY KEY, AUTO_INCREMENT | 그룹 고유 식별자 (PK)        |
| `grp_name`  | VARCHAR(100)     | NOT NULL                  | 그룹 이름                    |
| `user_id`   | INT              | NOT NULL, FOREIGN KEY     | 사용자 ID (users.user_id 참조) |
| `created_at`| TIMESTAMP        | DEFAULT CURRENT_TIMESTAMP | 레코드 생성 일시             |

**markers 테이블:**
| Column      | Type             | 제약조건                  | 설명                         |
| :---------- | :--------------- | :------------------------ | :--------------------------- |
| `id`        | INT              | PRIMARY KEY, AUTO_INCREMENT | 마커 고유 식별자 (PK)        |
| `name`      | VARCHAR(100)     | NOT NULL                  | 마커 이름                    |
| `description` | TEXT             | NULL                      | 마커 상세 설명 (추후 확장용) |
| `lat`       | DECIMAL(10, 7)   | NOT NULL                  | 위도 (Latitude)              |
| `lng`       | DECIMAL(10, 7)   | NOT NULL                  | 경도 (Longitude)             |
| `grp_id`    | INT              | NOT NULL, FOREIGN KEY     | 그룹 ID (groups.grp_id 참조) |
| `created_at`| TIMESTAMP        | DEFAULT CURRENT_TIMESTAMP | 레코드 생성 일시             |

### **4. API 엔드포인트 명세**

#### **4.1. 사용자 API (`/users`)**

##### **4.1.1. `POST /users/join`**
- **설명:** 새로운 사용자를 등록합니다.
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "userName": "홍길동"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "회원가입에 성공했습니다."
  }
  ```

##### **4.1.2. `POST /users/login`**
- **설명:** 사용자 로그인을 처리하고 JWT 토큰을 발급합니다.
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "로그인에 성공했습니다."
  }
  ```
- **Cookie:** `token` (JWT 토큰, httpOnly)

##### **4.1.3. `GET /users/check`**
- **설명:** 현재 로그인 상태를 확인합니다.
- **Method:** `GET`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "authenticated": true,
    "email": "user@example.com",
    "userName": "홍길동"
  }
  ```

##### **4.1.4. `POST /users/logout`**
- **설명:** 사용자 로그아웃을 처리합니다.
- **Method:** `POST`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "로그아웃 되었습니다."
  }
  ```

#### **4.2. 마커 API (`/markers`)**

##### **4.2.1. `GET /markers`**
- **설명:** 로그인한 사용자의 모든 마커 정보를 조회합니다.
- **Method:** `GET`
- **인증:** 필요 (JWT 토큰)
- **Response (200 OK):**
  ```json
  [
    {
      "id": 1,
      "grp_id": 1,
      "grp_name": "내 장소",
      "name": "카카오프렌즈 본사",
      "description": null,
      "lat": "37.5045020",
      "lng": "127.0536170",
      "created_at": "2025-01-19T00:00:00.000Z",
      "user_id": 1
    }
  ]
  ```

##### **4.2.2. `POST /markers`**
- **설명:** 새로운 마커를 생성합니다.
- **Method:** `POST`
- **인증:** 필요 (JWT 토큰)
- **Request Body:**
  ```json
  {
    "name": "새 마커",
    "lat": 37.1234567,
    "lng": 127.1234567,
    "grp_id": 1
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "id": 123
  }
  ```

##### **4.2.3. `PUT /markers/:id`**
- **설명:** 특정 마커의 정보를 수정합니다.
- **Method:** `PUT`
- **인증:** 필요 (JWT 토큰)
- **URL Parameter:** `:id` (마커 ID)
- **Request Body:**
  ```json
  {
    "name": "수정된 마커 이름",
    "grp_id": 2
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true
  }
  ```

##### **4.2.4. `DELETE /markers/:id`**
- **설명:** 특정 마커를 삭제합니다.
- **Method:** `DELETE`
- **인증:** 필요 (JWT 토큰)
- **URL Parameter:** `:id` (마커 ID)
- **Response (200 OK):**
  ```json
  {
    "success": true
  }
  ```

#### **4.3. 그룹 API (`/groups`)**

##### **4.3.1. `GET /groups`**
- **설명:** 로그인한 사용자의 모든 그룹을 조회합니다.
- **Method:** `GET`
- **인증:** 필요 (JWT 토큰)
- **Response (200 OK):**
  ```json
  [
    {
      "grp_id": 1,
      "grp_name": "내 장소",
      "user_id": 1,
      "created_at": "2025-01-19T00:00:00.000Z"
    },
    {
      "grp_id": 2,
      "grp_name": "맛집",
      "user_id": 1,
      "created_at": "2025-01-19T01:00:00.000Z"
    }
  ]
  ```

##### **4.3.2. `POST /groups`**
- **설명:** 새로운 그룹을 생성합니다.
- **Method:** `POST`
- **인증:** 필요 (JWT 토큰)
- **Request Body:**
  ```json
  {
    "grpName": "새 그룹"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "id": 3
  }
  ```

##### **4.3.3. `DELETE /groups/:id`**
- **설명:** 특정 그룹을 삭제합니다.
- **Method:** `DELETE`
- **인증:** 필요 (JWT 토큰)
- **URL Parameter:** `:id` (그룹 ID)
- **Response (200 OK):**
  ```json
  {
    "success": true
  }
  ```

---

### **5. 보안 및 인증**

#### **5.1. 인증 방식**
- **JWT (JSON Web Token)** 기반 인증 사용
- 토큰은 HTTP-only 쿠키에 저장되어 XSS 공격으로부터 보호됨
- 토큰 유효기간: 30분
- 모든 마커 및 그룹 관련 API는 인증이 필요함

#### **5.2. 비밀번호 보안**
- **PBKDF2** 알고리즘을 사용한 비밀번호 해싱
- 각 사용자마다 고유한 솔트(salt) 생성
- 반복 횟수: 10,000회
- 해시 길이: 10바이트 (base64 인코딩)

#### **5.3. 데이터 접근 제어**
- 사용자는 자신이 생성한 마커와 그룹만 조회/수정/삭제 가능
- 모든 쿼리에서 `user_id`를 조건으로 사용하여 데이터 격리

---

### **6. 환경 변수 설정**

`src` 폴더에 `.env` 파일을 생성하고 다음 변수들을 설정해야 합니다:

```env
# 서버 포트
PORT=3001

# 카카오맵 API 키
MAP_APP_KEY=your_kakao_map_api_key

# JWT 비밀키
PRIVATE_KEY=your_jwt_secret_key

# 데이터베이스 설정 (선택사항 - 코드에서 직접 설정 가능)
DB_HOST=localhost
DB_PORT=3307
DB_USER=devuser
DB_PASSWORD=1234
DB_NAME=MAPMARKER
```

---

### **7. 설치 및 실행 방법**

#### **7.1. 의존성 설치**
```bash
npm install
```

#### **7.2. 데이터베이스 설정**
MariaDB에서 다음 SQL을 실행하여 데이터베이스와 테이블을 생성합니다:

```sql
CREATE DATABASE MAPMARKER CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE MAPMARKER;

-- users 테이블
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- groups 테이블
CREATE TABLE groups (
    grp_id INT PRIMARY KEY AUTO_INCREMENT,
    grp_name VARCHAR(100) NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- markers 테이블
CREATE TABLE markers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    lat DECIMAL(10, 7) NOT NULL,
    lng DECIMAL(10, 7) NOT NULL,
    grp_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (grp_id) REFERENCES groups(grp_id) ON DELETE CASCADE
);
```

#### **7.3. 서버 실행**
```bash
node src/app.js
```

서버가 실행되면 `http://localhost:3001` (또는 설정한 PORT)에서 접속할 수 있습니다.
