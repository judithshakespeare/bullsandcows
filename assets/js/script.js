let modal = new bootstrap.Modal(document.getElementById('exampleModal'));
let modalBody = document.getElementById('modal-contents');

//랜덤한 n자리 수 숫자 배열 만들기
let randomNum = [];
function generateRandomNum() {
    let i = 3;
    while (randomNum.length < i) {
        let n = Math.floor(Math.random() * 9 + 1);
        if (randomNum.indexOf(n) === -1)
            randomNum.push(n);
    }
}
generateRandomNum();

//input값 받아서 배열 만들기
function generateInputNum() {
    let inputNum = [];
    let inputNumElem = document.getElementsByClassName("inputNum");
    for (let i = 0; i < inputNumElem.length; ++i) {
        let inputVal = Number(inputNumElem[i].value);
        inputNum.push(inputVal);
        modalBody.innerHTML = '';
        if (inputVal === '') { //input값 비어있으면 false
            modalBody.innerHTML += '숫자를 모두 입력해주세요.';
            modal.show();
            return false;
        }
        if (isNaN(inputVal)) { //input값 숫자 아니면 false
            modalBody.innerHTML += '숫자만 입력 가능합니다.';
            modal.show();
            return false;
        }
        if (inputNum.length !== new Set(inputNum).size) { //input값 중복이면 false(****오류!!수정하기****)
            modalBody.innerHTML += '중복된 숫자가 존재합니다.';
            modal.show();
            return false;
        }
    }
    return inputNum;
}

//Balls and Strikes
function ballsAndStrikes() {
    let inputNum = generateInputNum();
    let difference = randomNum.filter(x => inputNum.includes(x));
    let strikeCount = 0;
    for (let i = 0; i < randomNum.length; i++) {
        if (randomNum[i] === inputNum[i]) {
            strikeCount++;
        }
    }
    if (difference.length > 0 && difference.length == strikeCount) { // 스크라이크만 있을 때 -S 출력
        return strikeCount + 'S';
    } else if (difference.length > 0 && strikeCount == 0) { // 볼만 있을 때 -B 출력
        return difference.length + 'B';
    } else if (difference.length > 0 && strikeCount > 0) { // 스트라이크와 볼이 같이 있을 때 -B -S 출력
        return difference.length - strikeCount + 'B ' + strikeCount + 'S';
    } else {
        return '';
    }
}

//타이머
let timerDisplay = document.getElementById("timerDisplay");
let startTime, timer;
function startTimer() {
    startTime = new Date();
    timer = setInterval(function () {
        var now = new Date();
        timerDisplay.innerHTML = ((now - startTime) / 1000).toFixed(2);
    }, 10);
}
//타이머 멈추고 각 라운드 타임스탬프 배열에 push
let timeStamp = [];
function stopTimer() {
    clearInterval(timer);
    timeStamp.push(timerDisplay.innerHTML);
}

let playCount = 0;
let roundCount = 1;
let maxRound = 3; //실행가능 라운드
let resultWrapper = document.getElementById('result');

document.getElementById('submit').onclick = function () {
    if (generateInputNum()) { //input값에 문제가 없어야 실행
        playCount++;
        resultWrapper.innerHTML += '<div class="row"><div class="col">' + playCount + '회차</div><div class="col">' + generateInputNum() + '</div><div class="col">' + ballsAndStrikes() + '</div></div>';
        if (ballsAndStrikes() == 3 + 'S') {
            modalBody.innerHTML = '';
            modalBody.innerHTML += 'Win! ';
            modal.show();
            reStart();
        }
        document.querySelector('form').reset();
        document.getElementById("focus").focus();
    }
    if (playCount == 1) {
        startTimer();
    }
    if (playCount > 9) {
        reStart();
        roundCount++;
    }
    if (roundCount > maxRound) {
        console.log(timeStamp); // 타임스탬프 보여주기
        timeStamp = [];
        roundCount = 1;
    }
};

function reStart() {
    modalBody.innerHTML += roundCount+' 라운드가 끝났습니다.';
    modal.show();
    stopTimer();
    randomNum = [];
    generateRandomNum();
    playCount = 0;
    resultWrapper.innerHTML = '';
    document.querySelector('form').reset();
    document.getElementById("focus").focus();
}

document.querySelectorAll('.inputNum').forEach(el =>
    el.onkeyup = e => {
      if (e.target.value) {
        el.nextElementSibling.focus()
      }
    }
);
