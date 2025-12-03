document.addEventListener('DOMContentLoaded', () => {
    const inputArea = document.getElementById('jsonInput');
    const outputArea = document.getElementById('jsonOutput');
    const errorDisplay = document.getElementById('errorMessage');
    const formatButton = document.getElementById('formatButton');
    const copyButton = document.getElementById('copyButton');

    // 포맷팅 및 검증 기능을 수행하는 주 함수
    formatButton.addEventListener('click', () => {
        // 이전 오류 메시지 및 출력 내용을 초기화합니다.
        errorDisplay.textContent = '';
        outputArea.value = '';
        copyButton.style.display = 'none';

        const rawJsonText = inputArea.value.trim();

        // 1. 입력 내용이 비어있는지 확인
        if (rawJsonText === '') {
            errorDisplay.textContent = 'JSON 텍스트를 입력해주세요.';
            return;
        }

        try {
            // 2. JSON.parse()를 사용하여 유효성 검증
            // 유효하지 않으면 여기서 catch 블록으로 이동합니다.
            const parsedObject = JSON.parse(rawJsonText);

            // 3. JSON.stringify()를 사용하여 포맷팅 (들여쓰기 2칸)
            // null은 리플레이서 함수, 2는 들여쓰기 공백 수입니다.
            const formattedJsonText = JSON.stringify(parsedObject, null, 2);

            // 4. 성공적으로 포맷된 텍스트를 출력 영역에 표시
            outputArea.value = formattedJsonText;
            errorDisplay.textContent = '✅ JSON이 성공적으로 포맷 및 검증되었습니다.';
            copyButton.style.display = 'inline-block'; // 복사 버튼 표시

        } catch (error) {
            // 5. JSON 파싱 실패 시 오류 메시지 표시
            console.error(error);
            outputArea.value = rawJsonText; // 오류가 있는 원본 텍스트를 그대로 출력
            errorDisplay.textContent = `❌ 유효하지 않은 JSON입니다. 오류: ${error.message}`;
            copyButton.style.display = 'none';
        }
    });

    // 결과 복사 기능
    copyButton.addEventListener('click', () => {
        if (outputArea.value) {
            // 텍스트 영역의 내용을 클립보드에 복사
            outputArea.select();
            document.execCommand('copy');
            alert('JSON 텍스트가 클립보드에 복사되었습니다!');
        }
    });
});