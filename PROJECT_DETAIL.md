# 카카오맵 마커 관리 프로젝트 계획서

### **1. 프로젝트 개요**

#### **1.1. 프로젝트 설명**
본 프로젝트는 카카오맵 API를 활용하여 지도 위에 사용자가 직접 마커(Marker)를 생성, 조회, 수정, 삭제(CRUD)할 수 있는 웹 애플리케이션을 개발하는 것을 목표로 합니다. Node.js/Express로 백엔드 서버를 구축하고 MariaDB에 데이터를 영구적으로 저장하여, 사용자의 마커 정보를 관리합니다.

#### **1.2. 개발 환경**
- **운영체제:** Windows, macOS, Linux 등 무관
- **런타임:** Node.js 18.x 이상
- **데이터베이스:** MariaDB 10.x 이상
- **코드 에디터:** Visual Studio Code (권장)
- **API:** Kakao Maps API

#### **1.3. 기술 스택**
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Node.js, Express.js
- **Database:** MariaDB
- **Library:** Kakao Maps API (Web)

### **2. 요구사항 정의**

#### **2.1. 기능적 요구사항**
- **R (Read):** 사용자는 DB에 저장된 모든 마커를 지도 위에서 조회할 수 있다.
- **C (Create):** 사용자는 지도를 클릭하여 원하는 위치에 새로운 마커를 생성하고 이름을 지정할 수 있다.
- **U (Update):** 사용자는 기존 마커를 클릭하여 마커의 이름을 수정할 수 있다.
- **D (Delete):** 사용자는 기존 마커를 클릭하여 해당 마커를 삭제할 수 있다.
- **부가 기능:** 지도를 축소했을 때, 여러 마커가 겹치면 자동으로 그룹화(Clustering)되어야 한다.

#### **2.2. 비기능적 요구사항**
- **사용성:** 사용자가 직관적으로 기능을 파악하고 사용할 수 있어야 한다.
- **성능:** 페이지 로딩 시, 저장된 마커들이 2초 이내에 지도 위에 표시되어야 한다.

### **3. 시스템 설계**

#### **3.1. 시스템 아키텍처 (3-Tier Architecture)**
1.  **Client (Frontend):** 웹 브라우저에서 실행되는 `index.html` 파일. 사용자의 입력을 받아 상호작용하고, 카카오맵을 렌더링한다. 백엔드 서버와는 `fetch` API를 이용한 비동기 HTTP 통신(AJAX)으로 데이터를 주고받는다.
2.  **Server (Backend):** `app.js`로 실행되는 Node.js/Express 애플리케이션입니다. `database/connect/mariadb.js`에서 데이터베이스 연결을 관리하며, `app.js`는 클라이언트의 API 요청을 받아 비즈니스 로직을 처리하고 데이터베이스와 상호작용합니다.
3.  **Database (DB):** MariaDB. 모든 마커의 위치, 이름 등의 데이터를 영구적으로 저장하는 역할을 한다.

#### **3.2. 데이터베이스 설계 (Schema)**
- **Database:** `map_project`
- **Table:** `markers`

| Column      | Type             | 제약조건                  | 설명                         |
| :---------- | :--------------- | :------------------------ | :--------------------------- |
| `id`        | INT              | PRIMARY KEY, AUTO_INCREMENT | 마커 고유 식별자 (PK)        |
| `name`      | VARCHAR(100)     | NOT NULL                  | 마커 이름                    |
| `description` | TEXT             | NULL                      | 마커 상세 설명 (추후 확장용) |
| `lat`       | DECIMAL(10, 7)   | NOT NULL                  | 위도 (Latitude)              |
| `lng`       | DECIMAL(10, 7)   | NOT NULL                  | 경도 (Longitude)             |
| `created_at`| TIMESTAMP        | DEFAULT CURRENT_TIMESTAMP | 레코드 생성 일시             |

### **4. API 엔드포인트 명세**

#### **4.1. `GET /api/markers`**
- **설명:** 저장된 모든 마커의 정보를 조회합니다.
- **Method:** `GET`
- **Request:** 없음
- **Response (200 OK):**
  ```json
  [
    {
      "id": 1,
      "name": "카카오프렌즈 본사",
      "description": null,
      "lat": "37.5045020",
      "lng": "127.0536170",
      "created_at": "2025-09-19T00:00:00.000Z"
    }
  ]
  ```

#### **4.2. `POST /api/markers`**
- **설명:** 새로운 마커를 생성합니다.
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "name": "새 마커",
    "lat": 37.1234567,
    "lng": 127.1234567
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "id": 123
  }
  ```

#### **4.3. `PUT /api/markers/:id`**
- **설명:** 특정 마커의 정보를 수정합니다.
- **Method:** `PUT`
- **URL Parameter:** `:id`
- **Request Body:**
  ```json
  {
    "name": "수정된 마커 이름"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true
  }
  ```

#### **4.4. `DELETE /api/markers/:id`**
- **설명:** 특정 마커를 삭제합니다.
- **Method:** `DELETE`
- **URL Parameter:** `:id`
- **Request:** 없음
- **Response (200 OK):**
  ```json
  {
    "success": true
  }
  ```

---

### **5. 주차별 상세 개발 계획 (Step-by-Step)**

#### **1주차: 프로젝트 생성, 지도 표시, DB 데이터 조회**

**1. 프로젝트 폴더 생성 및 기본 패키지 설치**
- 터미널에서 아래 명령어를 순서대로 입력합니다.
  ```bash
  mkdir map-project && cd map-project
  npm init -y
  npm install express mariadb
  ```
- `map-project` 폴더 안에 `app.js` 와 `index.html` 파일을 생성합니다.

**2. MariaDB에 테이블 생성 및 테스트 데이터 추가**
- DB 관리툴에서 아래 SQL을 실행합니다.
  ```sql
  CREATE DATABASE map_project CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
  USE map_project;
  CREATE TABLE markers ( id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(100) NOT NULL, description TEXT, lat DECIMAL(10, 7) NOT NULL, lng DECIMAL(10, 7) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );
  INSERT INTO markers (name, lat, lng) VALUES ('카카오프렌즈 본사', 37.504502, 127.053617);
  INSERT INTO markers (name, lat, lng) VALUES ('국립중앙박물관', 37.523876, 126.980463);
  ```

**3. 백엔드 코드 작성**
- **DB 연동 (`database/connect/mariadb.js`)**
  - `database/connect` 폴더에 `mariadb.js` 파일을 생성하고 아래 코드를 붙여넣습니다. 이 파일은 데이터베이스 연결 풀(Pool)을 생성하고 관리하는 역할을 합니다. (DB `password` 등 접속 정보 수정 필요)
  ```javascript
  const mariadb = require('mariadb');
  
  const pool = mariadb.createPool({ 
      host: '127.0.0.1', 
      port: 3306, 
      user: 'root', 
      password: 'YOUR_PASSWORD', 
      database: 'map_project',
      connectionLimit: 10
  });
  
  module.exports = pool;
  ```

- **Express 서버 (`app.js`)**
  - `app.js`에는 아래 코드를 붙여넣습니다. 이 코드는 Express 서버를 설정하고, `mariadb.js`에서 DB 커넥션 풀을 가져와 API 요청을 처리합니다.
  ```javascript
  const express = require('express');
  const pool = require('./database/connect/mariadb'); // DB 커넥션 풀 가져오기
  const app = express();

  app.use(express.static(__dirname));
  app.use(express.json());

  app.get('/api/markers', async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query("SELECT * FROM markers");
      res.json(rows);
    } catch (err) { 
      res.status(500).send(err.toString()); 
    } finally { 
      if (conn) conn.release(); // 또는 conn.end() 대신 conn.release()를 사용하여 커넥션을 풀에 반환
    }
  });

  app.listen(3000, () => {
    console.log('서버가 3000번 포트에서 실행 중입니다.');
  });
  ```

**4. 프론트엔드 지도 코드 작성 (`index.html`)**
- `index.html`에 아래 코드를 붙여넣습니다. (`YOUR_APP_KEY` 수정 필요)
  ```html
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="utf-8"/><title>카카오맵 마커 프로젝트</title>
      <style> #map { width: 100%; height: 100vh; } </style>
  </head>
  <body>
      <div id="map"></div>
      <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_APP_KEY"></script>
      <script>
          document.addEventListener("DOMContentLoaded", function() {
              const map = new kakao.maps.Map(document.getElementById('map'), { center: new kakao.maps.LatLng(37.514575, 127.0495556), level: 5 });
              fetch('/api/markers').then(response => response.json()).then(markers => {
                  markers.forEach(markerInfo => {
                      new kakao.maps.Marker({ position: new kakao.maps.LatLng(markerInfo.lat, markerInfo.lng), title: markerInfo.name }).setMap(map);
                  });
              });
          });
      </script>
  </body>
  </html>
  ```

**5. 실행 및 확인**
- 터미널에서 `node app.js` 실행 후 `http://localhost:3000` 접속. 지도에 마커 2개가 표시되면 성공입니다.

#### **2주차: 마커 생성(Create) 및 삭제(Delete) 기능 구현**

**1. 백엔드: API 추가 (`app.js`)**
- `app.js`의 `app.get(...)` 아래에 다음 코드를 추가합니다.
  ```javascript
  // API: 새 마커 생성
  app.post('/api/markers', async (req, res) => {
    const { name, lat, lng } = req.body;
    let conn;
    try {
      conn = await pool.getConnection();
      const result = await conn.query("INSERT INTO markers (name, lat, lng) VALUES (?, ?, ?)", [name, lat, lng]);
      res.json({ success: true, id: result.insertId });
    } catch (err) { res.status(500).send(err.toString()); } finally { if (conn) conn.end(); }
  });

  // API: 마커 삭제
  app.delete('/api/markers/:id', async (req, res) => {
    const { id } = req.params;
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.query("DELETE FROM markers WHERE id = ?", [id]);
      res.json({ success: true });
    } catch (err) { res.status(500).send(err.toString()); } finally { if (conn) conn.end(); }
  });
  ```

**2. 프론트엔드: 기능 추가 (`index.html`)**
- `index.html`의 `<script>` 태그 안쪽 코드를 아래 내용으로 **전부 교체**합니다.
  ```javascript
  const map = new kakao.maps.Map(document.getElementById('map'), { center: new kakao.maps.LatLng(37.514575, 127.0495556), level: 5 });

  function displayMarker(markerInfo) {
      const marker = new kakao.maps.Marker({ position: new kakao.maps.LatLng(markerInfo.lat, markerInfo.lng), title: markerInfo.name });
      marker.setMap(map);
      const infowindow = new kakao.maps.InfoWindow({ content: `<div style="padding:5px;font-size:12px;">${markerInfo.name} <button onclick="deleteMarker(${markerInfo.id})">삭제</button></div>` });
      kakao.maps.event.addListener(marker, 'click', () => infowindow.open(map, marker));
  }

  function deleteMarker(id) {
      if (!confirm('정말 삭제하시겠습니까?')) return;
      fetch(`/api/markers/${id}`, { method: 'DELETE' }).then(() => {
          alert('삭제되었습니다.');
          window.location.reload();
      });
  }

  fetch('/api/markers').then(response => response.json()).then(data => data.forEach(displayMarker));

  kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
      const name = prompt('마커의 이름을 입력하세요:', '새 마커');
      if (!name) return;
      const newMarker = { name: name, lat: mouseEvent.latLng.getLat(), lng: mouseEvent.latLng.getLng() };
      fetch('/api/markers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMarker)
      }).then(response => response.json()).then(result => {
          newMarker.id = result.id;
          displayMarker(newMarker);
          alert('마커가 생성되었습니다.');
      });
  });
  ```

#### **3주차: 마커 수정(Update) 및 클러스터러 기능 추가**

**1. 백엔드: 수정 API 추가 (`app.js`)**
- `app.js`의 `app.delete(...)` 아래에 다음 코드를 추가합니다.
  ```javascript
  // API: 마커 정보 수정
  app.put('/api/markers/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.query("UPDATE markers SET name = ? WHERE id = ?", [name, id]);
      res.json({ success: true });
    } catch (err) { res.status(500).send(err.toString()); } finally { if (conn) conn.end(); }
  });
  ```

**2. 프론트엔드: 클러스터러 라이브러리 추가 (`index.html`)**
- `index.html`의 `<head>` 안의 `sdk.js` 스크립트 태그를 아래와 같이 `&libraries=clusterer`를 추가하여 교체합니다.
  ```html
  <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_APP_KEY&libraries=clusterer"></script>
  ```

**3. 프론트엔드: 수정 및 클러스터링 기능 추가 (`index.html`)**
- `index.html`의 `<script>` 태그 안쪽 코드를 아래 내용으로 **전부 교체**합니다.
  ```javascript
  const map = new kakao.maps.Map(document.getElementById('map'), { center: new kakao.maps.LatLng(37.514575, 127.0495556), level: 5 });
  const clusterer = new kakao.maps.MarkerClusterer({ map: map, averageCenter: true, minLevel: 6 });

  function getInfoWindowContent(info) {
      return `
          <div style="padding:10px;min-width:200px;">
              <div id="info-display-${info.id}">
                  <strong>${info.name}</strong><br>
                  <button onclick="showEditForm(${info.id}, '${info.name}')">수정</button>
                  <button onclick="deleteMarker(${info.id})">삭제</button>
              </div>
              <div id="info-edit-${info.id}" style="display:none;">
                  <input type="text" id="edit-name-${info.id}" value="${info.name}" style="width:95%;"><br>
                  <button onclick="updateMarker(${info.id})">저장</button>
                  <button onclick="hideEditForm(${info.id})">취소</button>
              </div>
          </div>`;
  }

  function showEditForm(id) { document.getElementById(`info-display-${id}`).style.display = 'none'; document.getElementById(`info-edit-${id}`).style.display = 'block'; }
  function hideEditForm(id) { document.getElementById(`info-display-${id}`).style.display = 'block'; document.getElementById(`info-edit-${id}`).style.display = 'none'; }

  function updateMarker(id) {
      const newName = document.getElementById(`edit-name-${id}`).value;
      if (!newName) { alert('이름을 입력하세요.'); return; }
      fetch(`/api/markers/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName })
      }).then(() => { alert('수정되었습니다.'); window.location.reload(); });
  }

  function deleteMarker(id) {
      if (!confirm('정말 삭제하시겠습니까?')) return;
      fetch(`/api/markers/${id}`, { method: 'DELETE' }).then(() => { alert('삭제되었습니다.'); window.location.reload(); });
  }

  function createMarker(markerInfo) {
      const marker = new kakao.maps.Marker({ position: new kakao.maps.LatLng(markerInfo.lat, markerInfo.lng) });
      const infowindow = new kakao.maps.InfoWindow({ content: getInfoWindowContent(markerInfo), removable: true });
      kakao.maps.event.addListener(marker, 'click', () => infowindow.open(map, marker));
      return marker;
  }

  fetch('/api/markers').then(response => response.json()).then(data => {
      const markers = data.map(createMarker);
      clusterer.addMarkers(markers);
  });

  kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
      const name = prompt('마커의 이름을 입력하세요:', '새 마커');
      if (!name) return;
      const newMarkerData = { name: name, lat: mouseEvent.latLng.getLat(), lng: mouseEvent.latLng.getLng() };
      fetch('/api/markers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMarkerData)
      }).then(response => response.json()).then(result => {
          newMarkerData.id = result.id;
          clusterer.addMarker(createMarker(newMarkerData));
          alert('마커가 생성되었습니다.');
      });
  });
  ```