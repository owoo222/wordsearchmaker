const form = document.querySelector("#login-form");

const handleSubmit = async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const sha256Password = sha256(formData.get("password")); // 받아온 password 해시형식으로 변환
  // {id: 'abc' , password : '123'} 이런형식에서 password 부분 가져오는거
  formData.set("password", sha256Password); // formData의 password에 sha256으로 해시형식으로 변환한 값 넣음

  const res = await fetch("/login", {
    method: "post",
    body: formData, // 위의 폼데이터를 body에 담아 서버에 보냄
  });
  const data = await res.json(); // 서버에서 데이터 받음
  const accessToken = data.access_token;
  window.localStorage.setItem("token", accessToken);
  alert("로그인 되었습니다!");

  window.location.pathname = "/";
};

form.addEventListener("submit", handleSubmit);
