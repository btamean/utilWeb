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

    const encodeButton = document.getElementById('encodeButton');

    if (encodeButton) { // encodeButton이 urlEncoder.html에만 있으므로, 이 코드는 해당 페이지에서만 실행됨
        const urlInput = document.getElementById('urlInput');
        const urlOutput = document.getElementById('urlOutput');
        const urlError = document.getElementById('urlErrorMessage');
        const decodeButton = document.getElementById('decodeButton');
        const urlCopyButton = document.getElementById('urlCopyButton');

        encodeButton.addEventListener('click', () => {
            const inputText = urlInput.value;
            urlError.textContent = '';
            urlCopyButton.style.display = 'none';

            if (inputText === '') {
                 urlError.textContent = 'Please enter text or URL to encode.';
                 return;
            }
            
            // 핵심 기능: encodeURIComponent()
            const encodedText = encodeURIComponent(inputText);
            urlOutput.value = encodedText;
            urlError.textContent = '✅ Text successfully URL Encoded.';
            urlCopyButton.style.display = 'inline-block';
        });

        decodeButton.addEventListener('click', () => {
            const inputText = urlInput.value;
            urlError.textContent = '';
            urlCopyButton.style.display = 'none';

            if (inputText === '') {
                urlError.textContent = 'Please enter URL to decode.';
                return;
            }

            try {
                // 핵심 기능: decodeURIComponent()
                const decodedText = decodeURIComponent(inputText);
                urlOutput.value = decodedText;
                urlError.textContent = '✅ URL successfully Decoded.';
                urlCopyButton.style.display = 'inline-block';
            } catch (e) {
                urlError.textContent = '❌ Invalid URL Encoding structure.';
                urlOutput.value = '';
            }
        });
        
        // Copy Result for URL
        urlCopyButton.addEventListener('click', () => {
            if (urlOutput.value) {
                urlOutput.select();
                document.execCommand('copy');
                alert('URL text copied to clipboard!');
            }
        });
    }

    const parseButton = document.getElementById('parseButton');

    if (parseButton) { // parseButton이 xmlParser.html에만 있으므로, 이 코드는 해당 페이지에서만 실행됨
        const xmlInput = document.getElementById('xmlInput');
        const xmlOutput = document.getElementById('xmlOutput');
        const xmlError = document.getElementById('xmlErrorMessage');
        const xmlCopyButton = document.getElementById('xmlCopyButton');
        
        const parser = new DOMParser();
        const serializer = new XMLSerializer();

        parseButton.addEventListener('click', () => {
            xmlError.textContent = '';
            xmlOutput.value = '';
            xmlCopyButton.style.display = 'none';

            const rawXmlText = xmlInput.value.trim();

            if (rawXmlText === '') {
                xmlError.textContent = 'Please enter XML text.';
                return;
            }

            try {
                // 1. DOMParser를 사용하여 XML 파싱 및 유효성 검사
                const xmlDoc = parser.parseFromString(rawXmlText, "application/xml");
                
                // 2. 파싱 오류 확인 (파서가 오류를 XML 문서로 반환하는 경우)
                const errorNode = xmlDoc.querySelector('parsererror');
                if (errorNode) {
                    // 오류 노드가 있으면 유효성 검사 실패
                    xmlError.textContent = `❌ XML Parsing Error: ${errorNode.textContent}`;
                    xmlOutput.value = rawXmlText;
                    return;
                }
                
                // 3. XMLSerializer를 사용하여 들여쓰기된(formatted) XML 문자열 생성
                // (순수한 XMLSerializer는 들여쓰기를 지원하지 않으므로, NodeList를 순회하며 수동으로 들여쓰기를 적용하는 helper 함수를 사용하는 것이 가장 일반적이지만, 여기서는 단순화된 방식으로 구현합니다.)
                
                // 간단한 XML 직렬화 및 출력 (들여쓰기는 기본적으로 지원되지 않음)
                const formattedXml = serializer.serializeToString(xmlDoc);

                xmlOutput.value = formatXmlString(formattedXml); // 아래 helper 함수 사용
                xmlError.textContent = '✅ XML successfully parsed and formatted.';
                xmlCopyButton.style.display = 'inline-block';
                
            } catch (error) {
                xmlOutput.value = rawXmlText;
                xmlError.textContent = `❌ General Error during Parsing: ${error.message}`;
            }
        });

        // Copy Result for XML
        xmlCopyButton.addEventListener('click', () => {
            if (xmlOutput.value) {
                xmlOutput.select();
                document.execCommand('copy');
                alert('XML text copied to clipboard!');
            }
        });
    }
});