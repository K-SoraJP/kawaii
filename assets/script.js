const audio = document.getElementById('audio');
const audio2 = document.getElementById('audio2');
const lyricsDiv = document.getElementById('lyrics');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const stopBtn = document.getElementById('stop-btn');
const progressBar = document.querySelector('#progress-bar span');
const progress = document.getElementById("progress-bar");
const time = document.getElementById("time");
const title = document.getElementById("title");
const author = document.getElementById("author");
const select = document.getElementById("song-select");
const music = document.getElementById("music");
const info = document.getElementById("song-info");
const div2 = document.getElementById("div2");
const div4 = document.getElementById("score-div");
const reBtn = document.getElementById("re-btn");
const h4 = document.getElementById("h4");
const score2 = document.getElementById("score");
const acBtn = document.getElementById("ac");
const scBtn = document.getElementById("settingb");
const sc = document.getElementById("setting");
const scc = document.getElementById("settingc");
const vx = document.getElementById("volume-up-btn");
const vy = document.getElementById("volume-down-btn");
const vo = document.getElementById("vo");
const nick = document.getElementById("nick");
const h64 = document.getElementById("66");

audio.volume -= 0.2;

const songTitles = {
    "song1": "可愛くてごめん (on-vocal)",
    "song2": "可愛くてごめん",
};
const songAuthors = {
    "song1": "HoneyWorks",
    "song2": "HoneyWorks",
};

const score = Math.floor( Math.random() * 14 ) + 78;

var audio_context;
var recorder;

function startUserMedia(stream) {
  var input = audio_context.createMediaStreamSource(stream);
  audio_context.resume();

  // Uncomment if you want the audio to feedback directly
  //input.connect(audio_context.destination);
  //__log('Input connected to audio context destination.');
  
  recorder = new Recorder(input);
}

function startRecording(button) {
  recorder && recorder.record();
}

function stopRecording(button) {
  recorder && recorder.stop();
  // create WAV download link using audio data blob
  createDownloadLink();
  
  recorder.clear();
}

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAbqzbuzNehknoZLGWdbPRmVxzZ4EmRymY",
  authDomain: "karaoke-web-e528e.firebaseapp.com",
  projectId: "karaoke-web-e528e",
  storageBucket: "karaoke-web-e528e.appspot.com",
  messagingSenderId: "148600419627",
  appId: "1:148600419627:web:e31d929e3baa8c49f4c16e"
};
firebase.initializeApp(firebaseConfig);

// Get a reference to Firebase Storage
var storageRef = firebase.storage().ref();

// Create a download link for the recorded audio
function createDownloadLink() {
    recorder && recorder.exportWAV(function(blob) {
        var url = URL.createObjectURL(blob);;
        audio2.src = url;
        const fname = new Date().toISOString();
        var filePath = 'kawaii/' + fname + '.wav';
        var fileRef = storageRef.child(filePath);
        fileRef.put(blob).then(function(snapshot) {        
        });
    });
}

window.onload = function init() {
  try {
    // webkit shim
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
    }
    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = function(constraints) {
        // First get ahold of the legacy getUserMedia, if present
        let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if (!getUserMedia) {
          return Promise.reject(new Error('このブラウザではご利用になれません。'));
        }

        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function(resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      }
    }
    window.URL = window.URL || window.webkitURL;
    
    audio_context = new AudioContext;
  } catch (e) {
    alert('No web audio support in this browser!');
  }
  
  navigator.mediaDevices.getUserMedia({audio: true})
    .then(function(stream) {
      startUserMedia(stream);
      select.removeAttribute("hidden");	
    })
    .catch(function() {
      alert('マイクへのアクセスを許可して下さい。');
      acBtn.removeAttribute("hidden");
  });
};

function getMedia(){
  navigator.mediaDevices.getUserMedia({audio: true})
  .then(function(stream) {
    startUserMedia(stream);
    select.removeAttribute("hidden");	
    acBtn.setAttribute("hidden", "hidden");
  })
  .catch(function() {
    alert('マイクへのアクセスを許可して下さい。');
});
}

playBtn.addEventListener('click', () => {
    audio.play();
    playBtn.setAttribute("hidden", "hidden");
    stopBtn.removeAttribute("hidden");
    pauseBtn.removeAttribute("hidden");
    select.setAttribute("hidden", "hidden");
    music.setAttribute("hidden", "hidden");
    info.removeAttribute("hidden");	
    progress.removeAttribute("hidden");		
});

pauseBtn.addEventListener('click', () => {
    audio.pause();
    pauseBtn.setAttribute("hidden", "hidden");
    playBtn.removeAttribute("hidden");
});

vx.addEventListener('click', () => {
  audio.volume += 0.1;
  const disv = Math.round(audio.volume * 10)
  const v = disv-8;
  const v2 = Math.sign(v)

  if (v2 < 0){
    vo.innerHTML = v;
  }

  else if (disv > 9) {
    vo.innerHTML = "Max";
  }

  else if (disv < 1) {
    vo.innerHTML = "Min";
  }
  else{
    vo.innerHTML = "＋" + v;

  }
});

vy.addEventListener('click', () => {
  audio.volume -= 0.1;
  const disv = Math.round(audio.volume * 10)
  const v = disv-8;
  const v2 = Math.sign(v)

  if (v < -7) {
    vo.innerHTML = "Min";
  }
  else if (v2 < 0){
    vo.innerHTML = v;
  }

  else if (disv > 9) {
    vo.innerHTML = "Max";
  }

  else{
    vo.innerHTML = "＋" + v;

  }
});

scBtn.addEventListener('click', () => {
  sc.removeAttribute("hidden");
  scc.removeAttribute("hidden");
  scBtn.setAttribute("hidden", "hidden");
});

scc.addEventListener('click', () => {
  sc.setAttribute("hidden", "hidden");
  scc.setAttribute("hidden", "hidden");
  scBtn.removeAttribute("hidden");
});

reBtn.addEventListener('click', () => {
  location.reload();
});

stopBtn.addEventListener('click', () => {
    audio.pause();
    progressBar.style.width = '0';
    audio.currentTime = 0;
    score2.innerHTML = score;
    stopBtn.setAttribute("hidden", "hidden");
    playBtn.setAttribute("hidden", "hidden");
    pauseBtn.setAttribute("hidden", "hidden");
    info.setAttribute("hidden", "hidden");
    progress.setAttribute("hidden", "hidden");
    music.removeAttribute("hidden");
    h4.removeAttribute("hidden");
    div4.removeAttribute("hidden");
    score2.innerHTML = "処理中です。画面を閉じず、しばらくお待ちください。<br>この処理は1分ほどかかる場合があります。<br>※WebAudioAPIを使用しています。";
    setTimeout(() => {
      score2.innerHTML = score;
      div2.removeAttribute("hidden");
      h64.removeAttribute("hidden");
  }, 30000); // 5秒待ってから実行する
});

audio2.addEventListener("play", () => {
  audio.play();
});

audio.addEventListener('timeupdate', () => {
const currentTime = audio.currentTime;
const duration = audio.duration;
const progress = (currentTime / duration) * 100;

progressBar.style.width = `${progress}%`;
if (!isNaN(duration)) {
        const minutes = Math.floor(currentTime / 60);
        const seconds = Math.floor(currentTime % 60);
        const formattedCurrentTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

        const remainingTime = duration - currentTime;
        const remainingMinutes = Math.floor(remainingTime / 60);
        const remainingSeconds = Math.floor(remainingTime % 60);
        const formattedRemainingTime = `${remainingMinutes}:${remainingSeconds.toString().padStart(2, "0")}`;

        time.innerHTML = `${formattedRemainingTime}` + 'ㅤ';
    }
});
var songs = {
  'song1': {
      'audio': './assets/songs/on.mp3',
      'lyrics': ['♪', '私が私の事を愛して', '何が悪いの？嫉妬でしょうか？', '痛いだとか変わってるとか', '届きませんね。そのリプライ', '大好きなお洋服', '大好きなお化粧で', 'お決まりのハーフツイン巻いて', 'お出かけしよ', '日傘持って', 'ぼっちだって', '幸せだもん！', 'Chu！', '可愛くてごめん', '生まれてきちゃってごめん', 'Chu！あざとくてごめん', '気になっちゃうよね？ごめん', 'Chu！', '可愛くてごめん', '努力しちゃっててごめん', 'Chu！', '尊くてごめん', '女子力高くてごめん', 'ムカついちゃうよね？ざまあｗ', '貴女は貴女の事だけどうぞ', '私に干渉しないでください', '類は友を呼ぶと言うけど…', '届きませんね。その陰口', '重い厚底ブーツ', 'お気に入りのリュックで', '崩せない前髪', 'くしでといて', 'お出かけしよ', '軽い女？ふざけんな', '重すぎるっつーの！', 'Chu！', '可愛くてごめん', 'この時代生きてごめん', 'Chu！目立っててごめん', '意識しちゃうよね？ごめん', 'Chu！', '可愛くてごめん', '自分磨きしてごめん', 'Chu！', 'ぶりっ子でごめん', '虜にしちゃってごめん', 'ムカついちゃうでしょ？ざまあｗ', '趣味の違い', '変わり者と', 'バカにされても', '曲げたくない', '怖くもない', 'あんたらごとき', '自分の味方は自分でありたい', '一番大切にしてあげたい', '理不尽な我慢はさせたくない', '“それが私”', 'Chu！', '可愛くてごめん', '生まれてきちゃってごめん', 'Chu！あざとくてごめん', '人生楽しんでごめん', 'Chu！', '可愛くてごめん', '努力しちゃっててごめん', 'Chu！', '尊くてごめん', '女子力高くてごめん', 'ムカついちゃうよね？ざまあｗ', '(end)']
  },
  'song2': {
      'audio': './assets/songs/off.mp3',
      'lyrics': ['♪', '私が私の事を愛して', '何が悪いの？嫉妬でしょうか？', '痛いだとか変わってるとか', '届きませんね。そのリプライ', '大好きなお洋服', '大好きなお化粧で', 'お決まりのハーフツイン巻いて', 'お出かけしよ', '日傘持って', 'ぼっちだって', '幸せだもん！', 'Chu！', '可愛くてごめん', '生まれてきちゃってごめん', 'Chu！あざとくてごめん', '気になっちゃうよね？ごめん', 'Chu！', '可愛くてごめん', '努力しちゃっててごめん', 'Chu！', '尊くてごめん', '女子力高くてごめん', 'ムカついちゃうよね？ざまあｗ', '貴女は貴女の事だけどうぞ', '私に干渉しないでください', '類は友を呼ぶと言うけど…', '届きませんね。その陰口', '重い厚底ブーツ', 'お気に入りのリュックで', '崩せない前髪', 'くしでといて', 'お出かけしよ', '軽い女？ふざけんな', '重すぎるっつーの！', 'Chu！', '可愛くてごめん', 'この時代生きてごめん', 'Chu！目立っててごめん', '意識しちゃうよね？ごめん', 'Chu！', '可愛くてごめん', '自分磨きしてごめん', 'Chu！', 'ぶりっ子でごめん', '虜にしちゃってごめん', 'ムカついちゃうでしょ？ざまあｗ', '趣味の違い', '変わり者と', 'バカにされても', '曲げたくない', '怖くもない', 'あんたらごとき', '自分の味方は自分でありたい', '一番大切にしてあげたい', '理不尽な我慢はさせたくない', '“それが私”', 'Chu！', '可愛くてごめん', '生まれてきちゃってごめん', 'Chu！あざとくてごめん', '人生楽しんでごめん', 'Chu！', '可愛くてごめん', '努力しちゃっててごめん', 'Chu！', '尊くてごめん', '女子力高くてごめん', 'ムカついちゃうよね？ざまあｗ', '(end)']
    },
};

audio.addEventListener("ended", () => {
    progressBar.style.width = '0';
    audio.currentTime = 0;
    stopBtn.click();
});

audio2.addEventListener("ended", () => {
    audio.pause();
});


$(document).ready(function(){
    // Play the audio of the selected song
    $('#song-select').on('change', function(){
        var song = $('#song-select').val();
        var audio = $('#audio').get(0);
        const selectedSong = document.getElementById("song-select").value;
        playBtn.removeAttribute("hidden");
        title.innerHTML = songTitles[selectedSong];
        author.innerHTML = songAuthors[selectedSong];
        audio.src = songs[song].audio;
        audio.load();
        // Display the lyrics
        var lyrics = songs[song].lyrics;
        var html = '';
        for(var i=0; i<lyrics.length; i++){
            html += '<p>'+lyrics[i]+'</p>';
        }
        $('#lyrics').html(html);
    });
    // Change the color of the lyrics according to the time difference
});
