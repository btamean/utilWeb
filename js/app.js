// js/app.js

// ---------------------------------------------
// 1. Header 로드 및 공통 로직
// ---------------------------------------------

function loadHeaderAndSetEvents() {
    const placeholder = document.getElementById('header-placeholder');
    // header-placeholder가 없는 페이지라면 아무것도 하지 않음
    if (!placeholder) return; 

    // Header HTML 파일의 내용을 가져옵니다.
    fetch('/header.html') // 웹사이트의 루트(Root)를 기준으로 파일을 찾으라는 의미
        .then(response => {
            if (!response.ok) {
                console.error('Failed to load header.html:', response.statusText);
                return '';
            }
            return response.text();
        })
        .then(html => {
            if (html) {
                placeholder.innerHTML = html;
                
                // Header 삽입 후, 현재 페이지에 맞는 active 클래스를 설정하고 이벤트를 연결합니다.
                setActiveNav();
                setupHeaderEvents();
            }
        })
        .catch(error => console.error('Error fetching header:', error));
}

// 네비게이션 활성화(Active) 상태를 설정하는 함수
function setActiveNav() {
    // 현재 URL 경로를 가져옵니다.
    const path = window.location.pathname; 
    
    // index.html 또는 루트 경로일 경우 Home 활성화
    if (path.endsWith('index.html') || path === '/') {
        const homeLink = document.getElementById('navHome');
        if (homeLink) homeLink.classList.add('active');
    } 
    // jsonFormatter.html 페이지인 경우 JSON Formatter 활성화
    else if (path.includes('jsonFormatter.html')) {
        const jsonLink = document.getElementById('navJson');
        if (jsonLink) jsonLink.classList.add('active');
    }
    // urlEncoder.html 페이지인 경우 URL Encoder 활성화
    else if (path.includes('urlEncoder.html')) {
        const urlLink = document.getElementById('navUrl');
        if (urlLink) urlLink.classList.add('active');
    }
}

// 헤더의 추가 이벤트(예: coming-soon 알림)를 설정하는 함수
function setupHeaderEvents() {
    // 'URL Encoder' 링크 (class="coming-soon-nav"가 있는 요소)에 클릭 이벤트 추가
    const urlLink = document.getElementById('navUrl');
    if (urlLink && urlLink.classList.contains('coming-soon-nav')) {
        urlLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert("URL Encoder is coming soon!");
        });
    }
    
    // (여기에 다른 공통 이벤트 로직을 추가할 수 있습니다.)
}


// ---------------------------------------------
// 2. DOMContentLoaded 이벤트 (메인 진입점)
// ---------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // Header 로드 및 설정 시작
    loadHeaderAndSetEvents();
    
    // (여기에 JSON Formatter 로직, URL Encoder 로직 등 페이지별 로직이 들어갑니다.)
    // * 참고: 현재는 jsonFormatter.html와 urlEncoder.html 페이지 로직이 필요합니다.
});