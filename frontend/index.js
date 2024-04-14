// const calcTime = (timestamp) => {
//     const curTime = new Date().getTime() - 9 * 60 * 60 * 1000;
//     // 이건 한국시간 == UTC +9 그러므로 세계시간과 맞춰주기위해 9시간 뺌
//     const time = new Date(curTime - timestamp);
//     const hour = time.getHours();
//     const minute = time.getMinutes();
//     const second = time.getSeconds();

//     if (hour > 0) return `${hour}시간 전`;
//     else if (minute > 0) return `${minute}분 전`;
//     else if (second > 0) return `${second}초 전`;
//     else return "방금 전";
//   };

//   const renderData = (data) => {
//     const main = document.querySelector("main");
//     data.reverse().forEach(async (obj) => {
//       const div = document.createElement("div");
//       div.className = "item-list";

//       const imgDiv = document.createElement("div");
//       imgDiv.className = "item-list_img";

//       const img = document.createElement("img");
//       const res = await fetch(`/images/${obj.id}`); // 이미지에 대한 blob 받아와서 src에 넣어주기 위해서 특정 id 맞는 값 받아옴
//       const blob = await res.blob(); // 받아온 값 blob 타입으로 바꿔주고
//       const url = URL.createObjectURL(blob); // blob 타입을 URL 형식으로 바꿔줌
//       img.src = url;

//       const InfoDiv = document.createElement("div");
//       InfoDiv.className = "item-list_info";

//       const InfoTitleDiv = document.createElement("div");
//       InfoTitleDiv.className = "item-list_info-title";
//       InfoTitleDiv.innerText = obj.title;

//       const InfoMetaDiv = document.createElement("div");
//       InfoMetaDiv.className = "item-list_info-meta";
//       InfoMetaDiv.innerText = obj.place + " " + calcTime(obj.insertAt);

//       const InfoPriceDiv = document.createElement("div");
//       InfoPriceDiv.className = "item-list_info-price";
//       InfoPriceDiv.innerText = obj.price;

//       imgDiv.appendChild(img);

//       InfoDiv.appendChild(InfoTitleDiv);
//       InfoDiv.appendChild(InfoMetaDiv);
//       InfoDiv.appendChild(InfoPriceDiv);
//       div.appendChild(imgDiv);
//       div.appendChild(InfoDiv);
//       main.appendChild(div);
//     });
//   };

// // 'login-btn' id를 가진 요소를 선택합니다.
// const loginButton = document.getElementById("login-btn");

// // 선택한 버튼에 클릭 이벤트 리스너를 추가합니다.
// loginButton.addEventListener("click", function () {
//   // 클릭 시 login.html 페이지로 이동합니다.
//   location.href = "login.html";
// });

const signupButton = document.getElementById("signup-btn");
signupButton.addEventListener("click", function () {
  location.href = "signup.html";
});

const makegameButton = document.getElementById("makegame-btn");
makegameButton.addEventListener("click", function () {
  location.href = "makegame.html";
});

const playgameButton = document.getElementById("playgame-btn");
playgameButton.addEventListener("click", function () {
  location.href = "playgame.html";
});
