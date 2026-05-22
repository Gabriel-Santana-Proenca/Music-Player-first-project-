const songName = document.getElementById('song-name');
const bandName = document.getElementById('band-name');
const song = document.getElementById('audio');
const cover = document.getElementById('cover');
const play = document.getElementById('play');
const next = document.getElementById('next');
const previous = document.getElementById('previous');
const currentProgress = document.getElementById('current-progress');
const progressContainer = document.getElementById('progress-container');
const shuffleButton = document.getElementById('shuffle');
const repeatButton = document.getElementById('repeat');
const songTime = document.getElementById('song-time');
const totalTime = document.getElementById('total-time');
const likeButton = document.getElementById('like');

const empireStateOfMind = {
    songName : 'Empire State Of Mind',
    artist : 'JAY-Z ft. Alicia Keys',
    file : 'Empire State Of Mind',
    liked: false,
};

const sweaterWeather = {
    songName : 'Sweater Weather',
    artist : 'The Neighbourhood',
    file : 'Sweater Weather',
    liked: false,
};
const partyGirl = {
    songName : 'Party Girl',
    artist : 'StaySolidRocky',
    file : 'Party Girl',
    liked: false,
};
const vanHayden = {
    songName : 'Van Hayden',
    artist : 'Bankrol Hayden',
    file : 'Van Hayden',
    liked: false,
};
const pinkWhite = {
    songName : 'Pink + White',
    artist : 'Frank Ocean',
    file : 'Pink + White',
    liked: false,
};
let isPlaying = false;
let isShuffled = false;
let repeatOn = false;
const originalPlaylist = JSON.parse(localStorage.getItem('playlist')) ?? [empireStateOfMind, sweaterWeather, partyGirl, vanHayden, pinkWhite];
let sortedPlaylist = [...originalPlaylist];
let index = 0;



function playSong() {
    play.querySelector('.bi').classList.remove('bi-play-circle');
    play.querySelector('.bi').classList.add('bi-pause-circle');
    song.play();
    isPlaying = true;
}

function pauseSong() {
    play.querySelector('.bi').classList.remove('bi-pause-circle');
    play.querySelector('.bi').classList.add('bi-play-circle');
    song.pause();
    isPlaying = false;
}

function playPauseDecider() {
    if(isPlaying === true){
       pauseSong();
    }
    else {
      playSong();
    }
}


function initializeSong() {
    cover.src = `images/${sortedPlaylist[index].file}.jpg`;
    song.src = `songs/${sortedPlaylist[index].file}.mp3`;
    songName.innerText = sortedPlaylist[index].songName;
    bandName.innerText = sortedPlaylist[index].artist;
    likeButtonRender();
}

function previousSong() {
    if(index === 0){
        index = sortedPlaylist.length - 1;
    }
    else{
        index -= 1;
    }
   initializeSong();
   playSong(); 
}

function nextSong() {
    if(index === sortedPlaylist.length - 1){
        index = 0;
    }
    else{
        index += 1;
    }
   initializeSong();
   playSong(); 
}

function updateProgress() {
  const barWidth = (song.currentTime/song.duration)*100;
  currentProgress.style.setProperty('--progress', `${barWidth}%`);
  songTime.innerText = toHHMMSS(song.currentTime);
}

function jumpTo(event) {
  const width = progressContainer.clientWidth;
  const clickPosition = event.offsetX;
  const jumpToTime = (clickPosition/width)* song.duration;
  song.currentTime = jumpToTime;
}

function shuffleArray(preShuffledArray) {
      const size = preShuffledArray.length;
      let currentIndex = size -1;
      while(currentIndex > 0){
          let randomIndex = Math.floor(Math.random()* size);
          let aux = preShuffledArray[currentIndex];
            preShuffledArray[currentIndex] = preShuffledArray[randomIndex];
            preShuffledArray[randomIndex] = aux;
            currentIndex -= 1;
      }

}

function likeButtonRender() {
    if (sortedPlaylist[index].liked === true){
        likeButton.querySelector('.bi').classList.remove('bi-heart');
        likeButton.querySelector('.bi').classList.add('bi-heart-fill');
        likeButton.classList.add('button-active');
    }
    else {
        likeButton.querySelector('.bi').classList.add('bi-heart');
        likeButton.querySelector('.bi').classList.remove('bi-heart-fill');
        likeButton.classList.remove('button-active');
    }
    }


function shuffleButtonClicked() {
    if(isShuffled === false){
        isShuffled = true;
        shuffleArray(sortedPlaylist);
        shuffleButton.classList.add('button-active');
    }
    else{
        isShuffled = false;
        sortedPlaylist = [...originalPlaylist];
        shuffleButton.classList.remove('button-active');
    }
}

function repeatButtonClicked() {
      if(repeatOn === false){
        repeatOn = true;
        repeatButton.querySelector('.bi').classList.remove('bi-repeat');
        repeatButton.querySelector('.bi').classList.add('bi-repeat-1');
        repeatButton.classList.add('button-active');
}
    else { 
       repeatOn = false;
        repeatButton.querySelector('.bi').classList.add('bi-repeat');
        repeatButton.querySelector('.bi').classList.remove('bi-repeat-1');
        repeatButton.classList.remove('button-active');
 }
}

function nextOrRepeat() {
    if(repeatOn === false) {
       nextSong();
    }
    else{
        playSong();
    }
}

function toHHMMSS(originalNumber) {
     let hours = Math.floor(originalNumber / 3600);
     let min = Math.floor((originalNumber - hours * 3600) / 60);
     let secs = Math.floor(originalNumber - hours * 3600 - min * 60);

     return `${min.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}


function updateTotalTime() {
    totalTime.innerText = toHHMMSS(song.duration); 
}

function likeButtonClicked() {
   if (sortedPlaylist[index].liked === false) {
    sortedPlaylist[index].liked = true;
   }
   else {    
      sortedPlaylist[index].liked = false;
   }
   likeButtonRender();
   localStorage.setItem('playlist', JSON.stringify(originalPlaylist));   
}

  

initializeSong();

play.addEventListener('click', playPauseDecider);
previous.addEventListener('click', previousSong);
next.addEventListener('click', nextSong);
song.addEventListener('timeupdate', updateProgress);
song.addEventListener('ended', nextOrRepeat);
song.addEventListener('loadedmetadata', updateTotalTime);
progressContainer.addEventListener('click', jumpTo);
shuffleButton.addEventListener('click', shuffleButtonClicked);
repeatButton.addEventListener('click', repeatButtonClicked);
likeButton.addEventListener('click', likeButtonClicked);