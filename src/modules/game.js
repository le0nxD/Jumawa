import { init } from './config';
import { timer } from './timer';
import { tetromino } from './tetrominoes';
import { display } from './display';
import { playground } from './playground';
import { inputs } from './inputs';
import { menu } from './menu';
import { sounds } from './audio';

export const game = {
  gameScore: 0,  // Skor permainan
  lines: 8,  // Jumlah baris yang sudah dihapus
  timerId: 0,  // ID untuk interval timer
  gameStatut: 'notStarted',  // Status permainan (belum dimulai)
  gameMode: '',  // Mode permainan
  speed: 0,  // Kecepatan permainan

  // Menginisialisasi permainan
  init() {
    playground.generateAllGrid();  // Membuat semua grid
    inputs.setListener(true);  // Mengatur listener input
    this.restore();  // Mengembalikan pengaturan permainan ke awal
  },

  // Keluar dari permainan
  quit() {
    this.restore();  // Mengembalikan pengaturan permainan ke awal
    playground.removeAllGrid();  // Menghapus semua grid
    document.getElementById('startButton').innerHTML = 'Start';  // Mengubah teks tombol ke 'Start'
    document.getElementById('startButton').classList.add('buttonPulse');  // Menambahkan animasi tombol
    inputs.setListener(false);  // Menonaktifkan listener input
    sounds.stop(sounds.theme1);  // Menghentikan musik tema
  },

  // Mengembalikan pengaturan permainan
  restore() {
    console.log('mengembalikan permainan');
    this.gameScore = 0;  // Mengatur skor kembali ke 0
    this.lines = 0;  // Mengatur jumlah baris yang dihapus kembali ke 0
    init.gameMode[this.gameMode].init();  // Menginisialisasi mode permainan yang sedang aktif
    this.updateScore(0);  // Memperbarui skor
    this.gameStatut = 'notStarted';  // Menandakan permainan belum dimulai
    display.endGame(false);  // Menyembunyikan tampilan game over
    display.pause(false);  // Menyembunyikan tampilan pause
    display.sidePanelInfo();  // Menampilkan informasi panel samping
    tetromino.initSaved();  // Menginisialisasi tetromino yang disimpan
    playground.deletingAnimation = 'init';  // Mengatur status animasi penghapusan
    clearInterval(this.timerId);  // Menghentikan timer
  },

  // Memulai permainan
  start() {
    if (this.gameStatut === 'lost' || this.gameStatut === 'end') {
      this.reset();  // Jika permainan selesai, reset permainan
    }
    if (this.gameStatut === 'notStarted') {
      console.log('permainan baru dimulai');
      sounds.playSong(sounds.playingTheme);  // Memainkan tema musik permainan
      tetromino.drawNew();  // Menggambar tetromino baru
      document.getElementById('startButton').classList.remove('buttonPulse');  // Menghapus animasi tombol
    }
    if (this.gameStatut === 'pause' || this.gameStatut === 'notStarted') {
      sounds.playSong(sounds.playingTheme);  // Memainkan tema musik permainan
      this.timerId = setInterval(this.run.bind(this), init.speedArray[this.speed - 1]);  // Memulai timer dengan kecepatan yang sesuai
      console.log('mode permainan', this.gameMode);
      init.gameMode[this.gameMode].start();  // Memulai mode permainan
      document.getElementById('startButton').innerHTML = 'Pause';  // Mengubah teks tombol menjadi 'Pause'
      document.getElementById('startButton').classList.remove('buttonPulse');  // Menghapus animasi tombol
      display.pause(false);  // Menyembunyikan tampilan pause
      this.gameStatut = 'play';  // Menandakan permainan sedang dimainkan
    } else {
      console.log('permainan dijeda');
      this.pause();  // Jika permainan sedang berjalan, jeda permainan
    }
  },

  // Menjeda permainan
  pause() {
    sounds.pause(sounds.playingTheme);  // Menghentikan musik permainan
    sounds.play(sounds.pauseSound);  // Memainkan suara jeda
    this.gameStatut = 'pause';  // Menandakan permainan dalam keadaan jeda
    display.pause(true);  // Menampilkan tampilan pause
    init.gameMode[this.gameMode].pause();  // Menjeda mode permainan
    document.getElementById('startButton').innerHTML = 'Resume';  // Mengubah teks tombol menjadi 'Resume'
    document.getElementById('startButton').classList.add('buttonPulse');  // Menambahkan animasi tombol
    clearInterval(this.timerId);  // Menghentikan timer
  },

  // Mereset permainan
  reset() {
    sounds.stop(sounds.playingTheme);  // Menghentikan musik permainan
    console.log('mereset permainan');
    playground.cleanAllGrid();  // Membersihkan semua grid
    playground.generatePlaygroundGrid();  // Membuat ulang grid playground
    this.restore();  // Mengembalikan pengaturan permainan
    tetromino.initSaved();  // Menginisialisasi tetromino yang disimpan
    this.gameStatut = 'notStarted';  // Menandakan permainan belum dimulai
    document.getElementById('startButton').innerHTML = 'Start';  // Mengubah teks tombol menjadi 'Start'
    document.getElementById('startButton').classList.add('buttonPulse');  // Menambahkan animasi tombol
    console.log('permainan telah direset');
  },

  // Kembali ke menu utama
  backMenu() {
    this.quit();  // Menghentikan permainan
    menu.showMenu(true);  // Menampilkan menu utama
  },

  // Menyimpan tetromino
  saveTetromino() {
    if (tetromino.canBeSaved) {
      if (tetromino.saved.tetromino.length > 0) {
        tetromino.undraw();  // Menghapus tetromino yang ada
        tetromino.switchSaved();  // Menukar tetromino yang sedang aktif dengan yang disimpan
        tetromino.drawSaved();  // Menggambar tetromino yang disimpan
        tetromino.undraw();  // Menghapus tetromino yang disimpan
        tetromino.draw();  // Menggambar tetromino yang baru
      } else {
        tetromino.saveTetromino();  // Menyimpan tetromino
        tetromino.drawSaved();  // Menggambar tetromino yang disimpan
        tetromino.undraw();  // Menghapus tetromino yang sedang aktif
        tetromino.drawNew();  // Menggambar tetromino yang baru
      }
      sounds.play(sounds.save);  // Memainkan suara ketika tetromino disimpan
    } else {
      console.log('tetromino sudah disimpan, tunggu tetromino berikutnya');
    }
  },

  // Memperbarui skor permainan
  updateScore() {
    const addedScore = this.lines * this.lines * 10;  // Skor yang ditambahkan berdasarkan jumlah baris yang dihapus
    this.gameScore += addedScore;  // Menambahkan skor
    document.getElementById('score').innerHTML = this.gameScore;  // Memperbarui tampilan skor
    document.getElementById('lines').innerHTML = this.lines;  // Memperbarui tampilan jumlah baris yang dihapus
  },

  // Meningkatkan kecepatan permainan
  increaseSpeed(value) {
    document.getElementById('speedBox').classList.add('flash');  // Menambahkan animasi pada kotak kecepatan
    setTimeout(() => {
      document.getElementById('speedBox').classList.remove('flash');  // Menghapus animasi setelah beberapa detik
    }, 700);
    console.log('meningkatkan kecepatan');
    clearInterval(this.timerId);  // Menghentikan timer sebelumnya
    this.speed += value;  // Meningkatkan nilai kecepatan
    this.timerId = setInterval(this.run.bind(this), init.speedArray[this.speed - 1]);  // Memulai timer dengan kecepatan baru
    document.getElementById('speed').innerHTML = this.speed;  // Memperbarui tampilan kecepatan
    sounds.play(sounds.speedup);  // Memainkan suara peningkatan kecepatan
  },

  // Menjalankan permainan
  run() {
    if (playground.deletingAnimation === 'onGoing') {
      return;  // Jika animasi penghapusan sedang berlangsung, tidak ada aksi yang dilakukan
    }
    if (init.gameMode[this.gameMode].end()) {
      sounds.stop(sounds.playingTheme);  // Menghentikan musik permainan jika permainan berakhir
      init.gameMode[this.gameMode].displayScore();  // Menampilkan skor permainan
      return;
    }
    const lineToDelete = playground.lineIsMade();  // Memeriksa apakah ada baris yang lengkap
    const tetrominoTouchDown = tetromino.freeze();  // Memeriksa apakah tetromino sudah mencapai bawah
    if (tetrominoTouchDown && lineToDelete.length && playground.deletingAnimation !== 'done') {
      init.gameMode[this.gameMode].lineCheck(lineToDelete);  // Memeriksa baris yang perlu dihapus
      this.lines += lineToDelete.length;  // Menambahkan jumlah baris yang dihapus
      this.updateScore();  // Memperbarui skor
      playground.animateDeleteLine(lineToDelete);  // Menampilkan animasi penghapusan baris
      playground.deletingAnimation = 'onGoing';  // Menandakan animasi penghapusan sedang berlangsung
      setTimeout(() => {
        playground.deletingAnimation = 'done';  // Menandakan animasi penghapusan selesai
      }, init.deletionAnimationSpeed);
      setTimeout(() => {
        sounds.play(sounds.land);  // Memainkan suara ketika tetromino mendarat
      }, init.deletionAnimationSpeed * 1.5);
      return;
    }
    if (tetrominoTouchDown) {
      sounds.justSmashed ? sounds.toggleSmash() : sounds.play(sounds.land);  // Memainkan suara ketika tetromino menyentuh dasar
      playground.deleteLine(lineToDelete);  // Menghapus baris yang sudah penuh
      playground.deletingAnimation = 'init';  // Mengatur status animasi penghapusan kembali ke awal
      tetromino.drawNew();  // Menggambar tetromino baru
      const lose = this.loseCondition();  // Memeriksa kondisi kekalahan
      if (lose) {
        sounds.stop(sounds.playingTheme);  // Menghentikan musik permainan
        sounds.play(sounds.gameover);  // Memainkan suara game over
        this.stop();  // Menghentikan permainan
        this.gameStatut = 'lost';  // Menandakan permainan berakhir kalah
        console.log('PERMAINAN KALAH');
        if (this.gameMode === 'enduro') {
          display.endGame(true, 'Permainan Selesai', this.gameScore, 'SKOR');  // Menampilkan tampilan game over dengan skor
        } else {
          display.endGame(true, 'GAME OVER', ' ', ' ');  // Menampilkan tampilan game over tanpa skor
          timer.pause();  // Menjeda timer
        }
      }
    } else {
      tetromino.moveDown();  // Jika tetromino belum menyentuh dasar, gerakkan tetromino ke bawah
    }
  },

  // Menghentikan permainan
  stop() {
    clearInterval(this.timerId);  // Menghentikan timer permainan
    document.getElementById('startButton').innerHTML = 'Restart';  // Mengubah teks tombol menjadi 'Restart'
  },

  // Memeriksa kondisi kekalahan
  loseCondition() {
    const gameLost = tetromino.current.some((index) => {
      return playground.blocks[tetromino.position + index].classList.contains('taken');  // Memeriksa apakah tetromino bertabrakan dengan blok yang sudah ada
    });
    return gameLost;
  },
};
