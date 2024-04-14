const form = document.querySelector("#signup-form");

const checkPassword = () => {
  const formData = new FormData(form);
  const password1 = formData.get("password"); // 각각 password1 , password2 값 가져와서 넣음
  const password2 = formData.get("password2");

  if (password1 === password2) {
    return true;
  } else return false;
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const sha256Password = sha256(formData.get("password")); // 받아온 password 해시형식으로 변환
  // {id: 'abc' , password : '123'} 이런형식에서 password 부분 가져오는거

  formData.set("password", sha256Password); // formData의 password에 sha256으로 해시형식으로 변환한 값 넣음

  const div = document.querySelector("#info");
  if (checkPassword()) {
    const res = await fetch("/signup", {
      method: "POST",
      body: formData, // 위의 폼데이터를 body에 담아 서버에 보냄
    });
    const data = await res.json(); // 서버에서 데이터 받았을때
    if (data === "200") {
      // div.innerText = "회원가입에 성공했습니다!";
      // div.style.color = "blue";
      alert("회원 가입에 성공했습니다."); // 회원가입 성공하면 해당 문구로 알림 띄워줌
      window.location.pathname = "/login.html"; // 그 후에 login.html 로 이동
    }
  } else {
    div.innerText = "비밀번호가 같지 않습니다.";
    div.style.color = "red";
  }
};

form.addEventListener("submit", handleSubmit);
