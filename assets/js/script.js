const inputAll = document.querySelectorAll('input');
const playBtn = document.getElementById('playBtn');
const resultDiv = document.getElementById('result');
const timerDiv = document.getElementById("timer");
const countRoundDiv = document.getElementById("countRound");
const form = document.querySelector('form');
const focusInput = document.getElementById("focus");
let randomNum = generateRandomNum();
let countRound = 1;
let countPlay = 0;
let maxRound = 3;
let timer;
let roundRecArr = [];

let modal = new bootstrap.Modal(document.getElementById('modal'));
let modalBody = document.getElementById('modal-contents');

(function () {
    countRoundDiv.innerHTML = ('Round ' + countRound);
})();

function showModal(message) {
    modalBody.innerHTML = message;
    modal.show();
}

inputAll.forEach(el =>
    el.onkeyup = e => {
        if (e.target.value) { // input 입력하면 자동으로 다음에 포커스
            el.nextElementSibling.focus()
        }
        if (isNaN(e.target.value)) { // 입력값이 숫자인지 체크
            showModal('숫자를 입력해주세요');
            e.target.value = "";
            e.target.focus();
        }
        if (e.target.value == '0') { // 입력값이 0인지 체크
            showModal('0은 입력할 수 없습니다');
            e.target.value = "";
            e.target.focus();
        }
    }
);

//input값 배열 만들기
function generateInputNum() {
    let inputNum = [];
    for (let i = 0; i < inputAll.length; i++) {
        inputNum.push(Number(inputAll[i].value));
        if (inputAll[i].value == '') { // input값 비어있으면 false 반환
            showModal('숫자를 모두 입력해주세요');
            inputAll[i].value = "";
            inputAll[i].focus();
            return false;
        }
        if (inputNum.length !== new Set(inputNum).size) {
            showModal('중복된 숫자가 존재합니다');
            modal.show();
            return false;
        }
    }
    return inputNum;
}

//랜덤한 n자리 수 숫자 배열 만들기
function generateRandomNum() {
    let randomNum = [];
    let i = 3;
    while (randomNum.length < i) {
        let n = Math.floor(Math.random() * 9 + 1);
        if (randomNum.indexOf(n) === -1)
            randomNum.push(n);
    }
    return randomNum;
}

playBtn.addEventListener('click', function () {
    let inputNum = generateInputNum();
    let record;
    if (inputNum) {
        countPlay++;
        resultDiv.innerHTML += '<div class="row"><div class="col">' + countPlay + '회차</div><div class="col">' + inputNum + '</div><div class="col">' + ballsAndStrikes(inputNum, randomNum) + '</div></div>';
        form.reset();
        focusInput.focus();
        if (countPlay == 1) {
            countRoundDiv.innerHTML = 'Round ' + countRound;
            startTimer();
        }
        if (countPlay == 10) { // 10회 플레이 후 새로운 라운드
            if (countRound <= maxRound) {
                showModal(countRound + ' 라운드가 끝났습니다');
            }
            restart();
        }
        if (ballsAndStrikes(inputNum, randomNum) == 'Win!') {
            showModal('정답입니다!');
            restart();
        }
        if (countRound > maxRound) {
            countRound = 1;
            countRoundDiv.innerHTML = '게임 종료';
            let minTime = Math.min.apply(null, roundRecArr);
            let minTimeIndex = roundRecArr.indexOf(minTime) + 1;
            resultDiv.innerHTML = '최고기록: ' + minTime + '(Round ' + minTimeIndex + ')';
            showModal('게임이 끝났습니다.');
            resultDiv.innerHTML = '';
        }
    }
    console.log(randomNum);
})

function restart() {
    stopTimer(); // 타이머 멈추기
    countPlay = 0; // countPlay 0으로 세팅
    countRound++;
    countRoundDiv.innerHTML = 'Round ' + countRound;
    randomNum = [];
    randomNum = generateRandomNum();
    timerDiv.innerHTML = '0.00'
    resultDiv.innerHTML = '';
}

function ballsAndStrikes(inputNum, randomNum) {
    let difference = inputNum.filter(x => randomNum.includes(x)); // randomNum, inputNum의 교집합
    let strikesCount = 0;
    for (let i = 0; i < randomNum.length; i++) {
        if (randomNum[i] === inputNum[i]) {
            strikesCount++;
        }
    }
    if (difference.length > 0 && difference.length == strikesCount) { // 스크라이크만 있을 때
        if (strikesCount == 3) {
            return 'Win!'
        } else {
            return strikesCount + 'S';
        }
    } else if (difference.length > 0 && strikesCount == 0) { // 볼만 있을 때
        return difference.length + 'B';
    } else if (difference.length > 0 && strikesCount > 0) { // 스트라이크와 볼이 같이 있을 때
        return difference.length - strikesCount + 'B ' + strikesCount + 'S';
    } else {
        return '';
    }
}

function startTimer() {
    let startTime = new Date();
    timer = setInterval(function () {
        let now = new Date();
        let timeRec = ((now - startTime) / 1000).toFixed(2);
        timerDiv.innerHTML = timeRec;
    }, 10);
}
function stopTimer() {
    clearInterval(timer);
    roundRecArr.push(Number(timerDiv.innerHTML));
}