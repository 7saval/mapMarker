/* Nav loader and auth initializer
   - Nav.load(containerId): fetches /navBar.html and inserts into container
   - Nav.initAuth(): calls /users/check and switches buttons (logout)
*/
(function(window){
  const Nav = {
    load: async function(containerId = 'navbar-container'){
      try{
        const res = await fetch('/navBar.html');
        if(!res.ok) throw new Error('navBar fetch failed: ' + res.status);
        const html = await res.text();
        const container = document.getElementById(containerId);
        if(!container) throw new Error('Nav container not found: ' + containerId);
        container.innerHTML = html;
        // after inserting DOM, run auth init
        await Nav.initAuth();
      }catch(err){
        console.error('Nav.load error', err);
      }
    },

    initAuth: async function(){
      try{
        const res = await fetch('/users/check', { credentials: 'include' });
        // if not ok, assume unauthenticated
        if(!res.ok){
          return;
        }
        const data = await res.json();
        const area = document.getElementById('nav-auth-area');
        if(!area) return;
        if(data && data.authenticated){
          // 로그인 상태: 로그인/회원가입 -> 사용자명 + 로그아웃 버튼
          const userName = data.userName || data.email || '';
          area.innerHTML = ` <span class="navbar-text text-light me-2">안녕하세요, ${userName}님</span> <button id="btn-logout" class="btn btn-outline-light" type="button">로그아웃</button>`;
          const btn = document.getElementById('btn-logout');
          if(btn){
            btn.addEventListener('click', async ()=>{
              try{
                await fetch('/users/logout', { method: 'POST', credentials: 'include' });
              }catch(e){
                console.error('logout error', e);
              }
              // 로그아웃 후 홈으로 이동
              location.href = '/';
            });
          }
        } else {
          // 비로그인 상태: navBar.html의 기본 마크업이 그대로 있으므로 아무것도 안함
        }
      }catch(err){
        console.error('Nav.initAuth error', err);
      }
    }
  };

  window.Nav = Nav;
})(window);
