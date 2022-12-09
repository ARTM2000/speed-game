const maxNumber = 25;
const maxStep = 120;
const firstBox = document.getElementById("first-box");
const playBtn = document.getElementById("play");
const expBox = document.getElementById("exp-box");
const num1 = document.getElementById("num1");
const num2 = document.getElementById("num2");
const symbol = document.getElementById("symbol");
const nextBtn = document.getElementById("next");
const resultInput = document.getElementById("result");
const resultBox = document.getElementById("result-box");
const resultTitle = document.getElementById("result-title");
const gameTimeBox = document.getElementById("game-time");
const validAns = document.getElementById("valid-ans");
const invalidAns = document.getElementById("invalid-ans");
const playAgainBtn = document.getElementById("play-again");
const operation = ["+", "−", "×", "÷"];
let experResult = []; // {n1, n2, op, rs}[]
let gameTime = [];

let stepsCount = 0;

nextBtn.addEventListener("click", () => {
	if (resultInput.value.match(/^[0-9]{1,}$/)) {
		next(resultInput.value);
	} else {
		alert("جواب رو وارد کن!");
		setTimeout(() => resultInput.focus(), 300);
	}
	resultInput.value = "";
});
resultInput.addEventListener("keypress", (e) => {
	if (e.key === "Enter") {
		if (resultInput.value.match(/^[0-9]{1,}$/)) {
			next(resultInput.value);
		} else {
			alert("جواب رو وارد کن!");
			setTimeout(() => resultInput.focus(), 300);
		}
		resultInput.value = "";
	}
});
playAgainBtn.addEventListener("click", (e) => {
	playAgain();
});
playBtn.addEventListener("click", (e) => {
	play();
});

function createStep() {
	let isNumbersFine = false;
	while (!isNumbersFine) {
		const operationIndex = Math.floor(Math.random() * operation.length);
		const randomNum1 = Math.floor(Math.random() * maxNumber);
		const randomNum2 = Math.floor(Math.random() * maxNumber);

		let value = 0;
		switch (operationIndex) {
			case 0:
				value = randomNum1 + randomNum2;
				break;

			case 1:
				value = randomNum1 - randomNum2;
				break;

			case 2:
				value = randomNum1 * randomNum2;
				break;

			case 3:
				value = randomNum1 / randomNum2;
				break;
		}
		if (
			value > 0 &&
			value < 20 &&
			Number.isInteger(value) &&
			randomNum1 !== num1.innerText &&
			randomNum2 !== num2.innerText
		) {
			isNumbersFine = true;
			return {
				newNum1: randomNum1,
				newNum2: randomNum2,
				opt: operationIndex,
			};
		}
	}
}

function newMath() {
	const { newNum1, newNum2, opt } = createStep();
	num1.innerHTML = newNum1;
	num2.innerHTML = newNum2;
	symbol.innerHTML = operation[opt];
	experResult.push({ n1: newNum1, n2: newNum2, op: opt, rs: null });
	stepsCount += 1;
	if (stepsCount > maxStep) {
		gameTime.push(new Date().valueOf());
		alert(`ایول! ${maxStep} تا تموم شد`);
		showAnswerResult();
	} else {
		resultInput.focus();
	}
}

function next(value) {
	experResult[experResult.length - 1].rs = +value;
	console.log("e", experResult);
	newMath();
}

function showAnswerResult() {
	const calcTime = calculateGameTime();
	let valid = 0,
		invalid = 0;
	for (const exp of experResult.slice(0, experResult.length - 1)) {
		console.log(" ---- ", exp);
		let value;
		switch (exp.op) {
			case 0:
				value = exp.n1 + exp.n2;
				break;

			case 1:
				value = exp.n1 - exp.n2;
				break;

			case 2:
				value = exp.n1 * exp.n2;
				break;

			case 3:
				value = exp.n1 / exp.n2;
				break;
		}
		if (value === exp.rs) {
			valid += 1;
		} else {
			invalid += 1;
		}
	}
	validAns.innerHTML = `<p>درست</p><p>${valid}</p>`;
	invalidAns.innerHTML = `<p>نادرست</p><p>${invalid}</p>`;
	gameTimeBox.innerHTML = calcTime;
	resultBox.hidden = false;
	expBox.hidden = true;
}

function playAgain() {
	stepsCount = 0;
	experResult = [];
	gameTime = [new Date().valueOf()];
	resultBox.hidden = true;
	expBox.hidden = false;
	newMath();
}

function play() {
	firstBox.hidden = true;
	expBox.hidden = false;
	gameTime.push(new Date().valueOf());
	newMath();
}

function humanReadableTimeDiff(t1, t2) {
	const diff = Math.max(t1, t2) - Math.min(t1, t2);
	const SEC = 1000,
		MIN = 60 * SEC,
		HRS = 60 * MIN;

	const hrs = Math.floor(diff / HRS);
	const min = Math.floor((diff % HRS) / MIN).toLocaleString("en-US", {
		minimumIntegerDigits: 2,
	});
	const sec = Math.floor((diff % MIN) / SEC).toLocaleString("en-US", {
		minimumIntegerDigits: 2,
	});
	const ms = Math.floor(diff % SEC).toLocaleString("en-US", {
		minimumIntegerDigits: 4,
		useGrouping: false,
	});

	return `${hrs}:${min}:${sec}.${ms}`;
}

function calculateGameTime() {
	const result = humanReadableTimeDiff(gameTime[0], gameTime[1]);
	gameTime = [];
	return result;
}
