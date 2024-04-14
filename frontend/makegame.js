const form = document.querySelector("#makegame-form");

const handleSubmit = async (event) => {
  event.preventDefault(); // 폼 제출 기본 동작 방지

  // 폼 데이터 수집
  const formData = {
    code: document.getElementById("code").value,
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    wordlist: [],
  };

  let isValid = true; // 모든 입력 값이 유효한지 추적하는 플래그

  // wordlist 입력 필드 값 수집 및 검증
  document.querySelectorAll('input[name="wordlist"]').forEach((input) => {
    const value = input.value;
    // 알파벳만 포함하는지 확인하는 정규 표현식
    const isAlphabetOnly = /^[A-Za-z]+$/;

    if (isAlphabetOnly.test(value)) {
      // 중복 제거를 위해 Set으로 변환 후 다시 배열로 변환
      formData.wordlist = [...new Set([...formData.wordlist, value])];
    } else {
      isValid = false; // 알파벳만 포함하지 않는 값이 있으면 유효하지 않음
    }
  });

  if (!isValid) {
    alert("wordlist에는 알파벳만 포함될 수 있습니다.");
    return; // 폼 전송 중단
  }

  // Fetch API를 사용하여 FastAPI 백엔드로 데이터 전송
  fetch("/playgame", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // 성공 응답 처리
      alert("게임이 생성 되었습니다!");
      window.location.pathname = "/";
    })
    .catch((error) => {
      console.error("Error:", error); // 오류 처리
    });
};

form.addEventListener("submit", handleSubmit);
