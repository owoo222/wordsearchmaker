let startTime; // 게임 시작 시간을 저장할 변수. 초기값은 설정하지 않음.
let timerInterval; // 실시간 타이머를 저장할 변수

function updateTimerDisplay() {
  const now = new Date();
  const elapsedTime = ((now - startTime) / 1000).toFixed(2);
  const timerDisplay = document.getElementById("realtimeTimer");
  timerDisplay.textContent = `경과 시간: ${elapsedTime}초`;
}
document.addEventListener("DOMContentLoaded", function () {
  let foundWords = new Set(); // 찾은 단어 목록
  let wordlist = []; // wordlist를 빈 배열로 초기화

  document
    .getElementById("playbutton_check")
    .addEventListener("click", function () {
      const gameCode = document.getElementById("gameCode").value;
      fetch(`/games/${gameCode}`)
        .then((response) => response.json())
        .then((data) => {
          displayGameInfo(data);

          // 타이머 생성 및 위치 조정을 게임 정보가 표시된 후에 수행
          createTimerDisplay();

          generatePuzzle(data.wordlist);
          displayWordList(data.wordlist);
          enableClickEffect(data.wordlist);
          wordlist = data.wordlist; // wordlist를 전역 변수에 저장

          // 타이머 시작
          startTime = new Date(); // 게임 시작 시간을 설정
          clearInterval(timerInterval); // 이전 타이머가 있다면 중지
          timerInterval = setInterval(updateTimerDisplay, 100); // 타이머 시작
        });

      function createTimerDisplay() {
        // 타이머가 이미 존재하는지 확인하고, 없다면 생성
        let timerDisplay = document.getElementById("realtimeTimer");
        if (!timerDisplay) {
          timerDisplay = document.createElement("div");
          timerDisplay.id = "realtimeTimer";
          timerDisplay.style.marginTop = "10px";
          const gameInfo = document.getElementById("gameInfo");
          gameInfo.parentNode.insertBefore(timerDisplay, gameInfo.nextSibling); // gameInfo 다음에 타이머 삽입
        }
      }
    });

  function displayGameInfo(game) {
    const infoDiv = document.getElementById("gameInfo");
    infoDiv.innerHTML = `Title: ${game.title}<br>Description: ${game.description}`;
  }
  function generatePuzzle(wordlist) {
    const puzzleDiv = document.getElementById("puzzle");
    puzzleDiv.innerHTML = ""; // Clear previous puzzle

    const rows = 14;
    const cols = 12;
    const grid = [];

    // 먼저 격자를 빈 문자로 초기화
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < cols; j++) {
        row.push(""); // 빈 칸으로 초기화
      }
      grid.push(row);
    }

    // 단어를 배치할 수 있는 위치를 찾는 함수 수정
    function findPosition(word, rows, cols) {
      let placed = false;
      while (!placed) {
        let direction = Math.floor(Math.random() * 3); // 0: 가로, 1: 세로, 2: 대각선
        let row, col;

        if (direction === 0) {
          // 가로 배치
          row = Math.floor(Math.random() * rows);
          col = Math.floor(Math.random() * (cols - word.length));
        } else if (direction === 1) {
          // 세로 배치
          row = Math.floor(Math.random() * (rows - word.length));
          col = Math.floor(Math.random() * cols);
        } else {
          // 대각선 배치
          row = Math.floor(Math.random() * (rows - word.length));
          col = Math.floor(Math.random() * (cols - word.length));
        }

        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          let newRow = row + (direction === 1 || direction === 2 ? i : 0);
          let newCol = col + (direction === 0 || direction === 2 ? i : 0);

          if (grid[newRow][newCol] !== "") {
            canPlace = false;
            break;
          }
        }

        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            let newRow = row + (direction === 1 || direction === 2 ? i : 0);
            let newCol = col + (direction === 0 || direction === 2 ? i : 0);
            grid[newRow][newCol] = word[i].toUpperCase(); // 단어를 대문자로 변환하여 배치
          }
          placed = true;
        }
      }
    }

    // wordlist에서 단어를 하나씩 가져와 격자에 배치
    wordlist.forEach((word) => {
      findPosition(word, rows, cols); // 수정된 위치 찾기 로직 사용
    });

    // 격자를 순회하며 빈 칸을 랜덤 알파벳으로 채우기
    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === "") {
          cell = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
        }
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.textContent = cell;
        puzzleDiv.appendChild(tile);
      });
      puzzleDiv.appendChild(document.createElement("br"));
    });
  }
  function displayWordList(wordList) {
    const listElement = document.getElementById("wordList");
    listElement.innerHTML = ""; // 이전 목록을 지우는 코드
    wordList.forEach((word) => {});
  }

  function enableClickEffect(wordlist) {
    const puzzleDiv = document.getElementById("puzzle");
    const wordListDiv = document.getElementById("wordList");
    let selectedTiles = []; // 사용자가 선택한 타일을 저장할 배열

    function checkAnswer(selectedWord) {
      // 선택된 단어가 wordlist에 있는지 확인
      return wordlist.includes(selectedWord.toLowerCase());
    }

    wordlist.forEach((word) => {
      const wordElement = document.createElement("div");
      wordElement.textContent = word;
      wordElement.classList.add("word"); // 단어에 대한 클래스 추가
      wordListDiv.appendChild(wordElement);
    });

    document
      .getElementById("playbutton_check")
      .addEventListener("click", function () {
        const gameCode = document.getElementById("gameCode").value;
        fetch(`/games/${gameCode}`)
          .then((response) => response.json())
          .then((data) => {
            displayGameInfo(data);
            generatePuzzle(data.wordlist);
            displayWordList(data.wordlist);
            enableClickEffect(data.wordlist);
            wordlist = data.wordlist;
            startTime = new Date();
            clearInterval(timerInterval);
            timerInterval = setInterval(updateTimerDisplay, 100);
          });
      });

    puzzleDiv.addEventListener("click", (e) => {
      if (e.target.className.includes("tile")) {
        const tile = e.target;

        // "correct" 클래스가 적용된 타일도 포함하여 처리할 수 있도록 해줌
        if (!selectedTiles.includes(tile)) {
          // 타일을 선택 목록에 추가
          selectedTiles.push(tile);
          if (!tile.classList.contains("correct")) {
            // "correct" 클래스가 없는 타일에 대해서만 "highlight" 적용
            tile.classList.add("highlight");
          }
        } else {
          // 이미 선택된 타일이면 선택 해제 (단, "correct" 클래스가 없는 경우에만)
          if (!tile.classList.contains("correct")) {
            selectedTiles = selectedTiles.filter((t) => t !== tile);
            tile.classList.remove("highlight");
          }
        }

        // 선택된 타일로 단어 생성 및 로직 실행
        const selectedWord = selectedTiles.map((t) => t.textContent).join("");
        console.log("선택된 단어: ", selectedWord);

        // 정답 검사
        if (checkAnswer(selectedWord, wordlist)) {
          // checkAnswer 함수를 사용하여 정답 검사
          foundWords.add(selectedWord); // 찾은 단어 집합에 추가
          selectedTiles.forEach((tile) => tile.classList.remove("highlight"));
          selectedTiles.forEach((tile) => tile.classList.add("correct"));
          selectedTiles = []; // 선택된 타일 목록 초기화

          // wordListDiv에서 정답 단어 스타일 변경
          const correctWordElement = Array.from(wordListDiv.children).find(
            (element) =>
              element.textContent.toLowerCase() === selectedWord.toLowerCase()
          );
          if (correctWordElement) {
            correctWordElement.classList.add("found"); // 단어에 'found' 클래스 추가하여 스타일 적용
          }

          // 모든 단어를 찾았는지 확인
          if (foundWords.size === wordlist.length) {
            clearInterval(timerInterval); // 실시간 타이머 정지
            const endTime = new Date();
            const totalTime = ((endTime - startTime) / 1000).toFixed(2);
            alert(`축하합니다! 모든 단어를 찾는 데 걸린 시간: ${totalTime}초`);
            window.location.pathname = "/";
          }
        } else if (
          selectedWord.length > 0 &&
          !checkAnswer(selectedWord, wordlist)
        ) {
          // checkAnswer 함수를 사용하여 정답이 아닌 경우 처리
          setTimeout(() => {
            selectedTiles.forEach((tile) => {
              if (!tile.classList.contains("correct")) {
                tile.classList.remove("highlight");
              }
            });
            selectedTiles = []; // 선택된 타일 목록 초기화
          }, 1000);
        }
      }
    });
  }

  enableClickEffect(wordlist);
});
