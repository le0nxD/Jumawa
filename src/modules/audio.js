export let sounds = {
  theme1: new Audio('./sound/origTheme.mp3'),  // Tema musik utama
  land: new Audio('./sound/samples/land.mp3'),  // Suara ketika tetromino mendarat
  level: new Audio('./sound/samples/level.mp3'),  // Suara ketika level meningkat
  move: new Audio('./sound/samples/move.mp3'),  // Suara ketika tetromino bergerak
  rotate: new Audio('./sound/samples/rotate.mp3'),  // Suara ketika tetromino diputar
  smack: new Audio('./sound/samples/shift.mp3'),  // Suara saat tetromino dipindahkan secara cepat
  pauseSound: new Audio('./sound/samples/pause.mp3'),  // Suara saat permainan dijeda
  line: new Audio('./sound/samples/line.mp3'),  // Suara saat satu baris terhapus
  tetris: new Audio('./sound/samples/tetris.mp3'),  // Suara ketika Tetris terjadi (4 baris terhapus sekaligus)
  gameover: new Audio('./sound/samples/gameover.mp3'),  // Suara ketika permainan berakhir
  speedup: new Audio('./sound/samples/speedup.mp3'),  // Suara saat kecepatan permainan meningkat
  save: new Audio('./sound/samples/save.mp3'),  // Suara saat tetromino disimpan
  justSmashed: false,  // Menyimpan status apakah tetromino baru saja menghantam dasar
  playingTheme: 0,  // Menyimpan tema musik yang sedang diputar
  musicEnabled: true,  // Menyimpan status apakah musik diaktifkan

  // Fungsi untuk membalik status "justSmashed"
  toggleSmash() {
    this.justSmashed = !this.justSmashed;
  },

  // Fungsi untuk memutar musik tema jika musik diaktifkan
  playSong(theme) {
    if (this.musicEnabled) {
      theme.play();  // Memutar musik tema
      theme.loop = true;  // Memutar musik dalam loop
      theme.volume = 0.5;  // Mengatur volume musik
    }
  },

  // Fungsi untuk memutar suara tertentu
  play(theme) {
    this.stop(theme);  // Menghentikan suara yang sedang diputar
    theme.play();  // Memutar suara yang dipilih
  },

  // Fungsi untuk menghentikan suara tertentu
  stop(theme) {
    theme.pause();  // Menjeda suara
    theme.currentTime = 0;  // Mengatur waktu suara ke awal
  },

  // Fungsi untuk menjeda suara tertentu
  pause(theme) {
    theme.pause();  // Menjeda suara
  },

  // Fungsi untuk mengaktifkan atau menonaktifkan musik
  enableMusic(bool) {
    bool ? (this.musicEnabled = true) : (this.musicEnabled = false);  // Menetapkan status musik
  },
};
