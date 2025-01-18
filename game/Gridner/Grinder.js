let timer_start, timer_game, timer_finish, timer_time, good_positions, wrong, right, speed, speed1, timerStart, positions;
let game_started = false;
let streak = 0;
let max_streak = 0;
let best_time = 99.999;

let timeouts = [];

let mode = 6;
let mode_data = {};
mode_data[5] = [5, '92px'];
mode_data[6] = [8, '74px'];
mode_data[7] = [14, '61px'];
mode_data[8] = [18, '51px'];
mode_data[9] = [20, '44px'];
mode_data[10] = [24, '38px'];


speed1 = parseInt(document.querySelector('#speed1').value);


// Get max streak from cookie
const regex = /max-streak_thermite=([\d]+)/g;
let cookie = document.cookie;
if((cookie = regex.exec(cookie)) !== null){
    max_streak = cookie[1];
}
// Get max streak from cookie
const regex_time = /best-time_thermite=([\d.]+)/g;
cookie = document.cookie;
if((cookie = regex_time.exec(cookie)) !== null){
    best_time = parseFloat(cookie[1]);
}

const sleep = (ms, fn) => {return setTimeout(fn, ms)};

const range = (start, end, length = end - start + 1) => {
    return Array.from({length}, (_, i) => start + i)
}

const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      for (let j = i; j > 0; j--) {
        const randomIndex = Math.floor(Math.random() * (j + 1));
        const temp = arr[j];
        arr[j] = arr[randomIndex];
        arr[randomIndex] = temp;
      }
    }
};

// Options
document.querySelector('#speed').addEventListener('input', function(ev){
    document.querySelector('.speed_value').innerHTML = ev.target.value + 's';
    streak = 0;
    reset();
});
document.querySelector('#speed1').addEventListener('input', function(ev){
  document.querySelector('.value').innerHTML = ev.target.value + 's';
  speed1 = parseInt(ev.target.value);
  streak = 0;
  reset();
});
document.querySelector('#grid').addEventListener('input', function(ev){
    document.querySelector('.grid_value').innerHTML = ev.target.value + 'x' + ev.target.value;
    mode = ev.target.value;
    streak = 0;
    reset();
});


// Resets
document.querySelector('.btn_again').addEventListener('click', function(){
    streak = 0;
    expectedNumber = 1;
    reset();
});

var numbers = [];
var endValue = mode_data[mode][0];

for (var i = 1; i <= endValue; i++) {
    numbers.push(i);
}

// Function to get a random number without repetition
function getRandomNumber() {
    if (numbers.length === 0) {
        // All numbers have been used, reset the array
        numbers = [];
        endValue = mode_data[mode][0];

        for (var i = 1; i <= endValue; i++) {
            numbers.push(i);
        }
    }

    // Generate a random index within the current length of the array
    var index = Math.floor(Math.random() * numbers.length);

    // Get the number at the randomly selected index
    var number = numbers[index];

    // Remove the selected number from the array
    numbers.splice(index, 1);

    return number;
}

let expectedNumber = 1; // Initialize the expected number to 1
let clickedNumbers = [];

function listener(ev) {
  if (!game_started) return;

  const clickedBlock = ev.target;
  const clickedNumber = parseInt(clickedBlock.textContent);

  if (clickedNumber === expectedNumber) {
    // User clicked the expected number

    right++;
    clickedNumbers.push(clickedNumber);
    clickedBlock.classList.add('good');
    //clickedBlock.style.color = '';
    expectedNumber++; // Increment the expected number for the next click
   
  } else {
    // User clicked the wrong number
    wrong++;
    clickedBlock.classList.add('bad');

    if (clickedNumbers.includes(clickedNumber)) {
      // User clicked a number that has already been clicked
    wrong++;
    clickedBlock.classList.add('bad');

    blocks.forEach(block => {
        block.style.color = ''; // Reset the color to default for all blocks
      });
      resetTimer();
      alert("You already clicked number " +clickedNumber);
    }

    blocks.forEach(block => {
        block.style.color = ''; // Reset the color to default for all blocks
      });
  }

  check();
}

function addListeners(){
    blocks.forEach(el => {
        el.addEventListener('mousedown', listener);
    });
}

function reset() {
    game_started = false;
  
    resetTimer();
    clearTimeout(timer_start);
    clearTimeout(timer_game);
    clearTimeout(timer_finish);
  
    document.querySelector('.splash').classList.remove('hidden');
    document.querySelector('.groups').classList.add('hidden');
  
    document.querySelectorAll('.group').forEach(el => {
      el.remove();
    });
    speed = document.querySelector('#speed').value;
    expectedNumber = 1;
  
    // Clear the stored timeouts
    timeouts.forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
    timeouts = [];
    clickedNumbers = [];
    start();
  }
  
  function check() {
    if (wrong === 1) {
      resetTimer();
      game_started = false;
      streak = 0;
      stopTimer();
  
      good_positions.forEach(pos => {
        blocks[pos].classList.add('proper');
      });
      return;
    }
    if (right === mode_data[mode][0]) {
      stopTimer();
      streak++;
      if (streak > max_streak) {
        max_streak = streak;
        document.cookie = "max-streak_thermite=" + max_streak;
      }
      let time = document.querySelector('.streaks .time').innerHTML;
      if (parseFloat(time) < best_time) {
        best_time = parseFloat(time);
        document.cookie = "best-time_thermite=" + best_time;
      }
      let leaderboard = new XMLHttpRequest();
      leaderboard.open(
        "HEAD",
        'streak.php?streak=' +
          streak +
          '&max_streak=' +
          max_streak +
          "&speed=" +
          speed +
          "&mode=" +
          mode +
          "&time=" +
          time
      );
      leaderboard.send();
      reset();
    }
  }
  
  

  function start() {
    wrong = 0;
    right = 0;
    
    positions = range(0, Math.pow(mode, 2) - 1);
    shuffle(positions);
    good_positions = positions.slice(0, mode_data[mode][0]);
  
    let div = document.createElement('div');
    div.classList.add('group');
    div.style.width = mode_data[mode][1];
    div.style.height = mode_data[mode][1];
    const groups = document.querySelector('.groups');
    for (let i = 0; i < positions.length; i++) {
      let group = div.cloneNode();
      group.dataset.position = i.toString();
      groups.appendChild(group);
    }
  
    blocks = document.querySelectorAll('.group');
    addListeners();
  
    document.querySelector('.streak').innerHTML = streak;
    document.querySelector('.max_streak').innerHTML = max_streak;
    document.querySelector('.best_time').innerHTML = best_time;
  
    timer_start = sleep(3000, function () {
      document.querySelector('.splash').classList.add('hidden');
      document.querySelector('.groups').classList.remove('hidden');
  
      speed = document.querySelector('#speed').value;
  
      good_positions.forEach(pos => {

        blocks[pos].classList.add('good');
  
        setBlockColorAndText(blocks[pos], pos);
      });
      startTimer();
      timer_game = sleep(speed1*1000, function () {
        document.querySelectorAll('.group.good').forEach(el => {
          //el.classList.remove('good');
        });
        document.querySelectorAll('.group').forEach(el => {
          el.style.cursor = 'pointer';
        });
        game_started = true;
        resetTimer();
        startTimer();
        timer_finish = sleep(speed * 1000, function () {
          game_started = false;
          wrong = 1;
          check();
          document.querySelectorAll('.group').forEach(el => {
            el.style.cursor = 'not-allowed';
          });
          
        });
      });
    });
  }
  
  function setBlockColorAndText(block, pos) {
    block.textContent = getRandomNumber();
  
    timeouts.push(
        setTimeout(function() {
            blocks[pos].style.color = 'transparent';
            setTimeout(function() {
                blocks[pos].style.color = ''; // Reset to default color
            }, speed * 1000); // Start after the specified delay
        }, speed1*1000)
    );
  }
  

function startTimer(){
    timerStart = new Date();
    timer_time = setInterval(timer,1);
}
function timer(){
    let timerNow = new Date();
    let timerDiff = new Date();
    timerDiff.setTime(timerNow - timerStart);
    let ms = timerDiff.getMilliseconds();
    let sec = timerDiff.getSeconds();
    if (ms < 10) {ms = "00"+ms;}else if (ms < 100) {ms = "0"+ms;}
    document.querySelector('.streaks .time').innerHTML = sec+"."+ms;
}
function stopTimer(){
    clearInterval(timer_time);
}
function resetTimer(){
    clearInterval(timer_time);
    document.querySelector('.streaks .time').innerHTML = '0.000';
}

let blocks = document.querySelectorAll('.group');
start();
