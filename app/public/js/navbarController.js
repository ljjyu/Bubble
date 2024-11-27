document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.querySelector('.navbar__toogleBtn');
    const menu = document.querySelector('.navbar__menu');
    const icons = document.querySelector('.navbar__icons');

    toggleBtn.addEventListener('click', () => {
        menu.classList.toggle('active');
        icons.classList.toggle('active');
    });
});

// script.js
document.addEventListener("DOMContentLoaded", function() {
    const darkModeButton = document.getElementById("dark-mode");
    const body = document.body;

    // 다크모드 토글 함수
    if (darkModeButton) {
        darkModeButton.addEventListener("click", function() {
            body.classList.toggle("dark-mode");

            // 현재 상태를 로컬 스토리지에 저장
            if (body.classList.contains("dark-mode")) {
                localStorage.setItem("darkMode", "enabled");
            } else {
                localStorage.setItem("darkMode", "disabled");
            }
        });
    }

    // 페이지 로드 시 다크모드 상태를 로컬 스토리지에서 읽어옴
    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark-mode");
    }
});

