import { game } from './game';
import { timer } from './timer';
import { display } from './display';
import { sounds } from './audio';

export const init = {
  blockSize: 25,  // Ukuran blok standar
  maxBlockSize: 26,  // Ukuran blok maksimal
  minBlockSize: 10,  // Ukuran blok minimal
  rows: 20,  // Jumlah baris pada grid permainan
  columns: 10,  // Jumlah kolom pada grid permainan
  timerCountPrecision: 10, // Satu detik per seperseratus detik
  timerDisplayPrecision: 1000, // Menampilkan setiap detik
  speedArray: [
    2360,
    1460,
    920,
    590,
    388,
    259.8,
    177.5,
    123.6,
    87.9,
    63.61,
    46.93,
    35.256,
    26.977,
    21.017,
    16.67,
  ],
  devMode: false,  // Mode pengembangan (jika diaktifkan, menampilkan informasi debugging)
  deletionAnimationSpeed: 500,  // Kecepatan animasi penghapusan baris
  previewSize: 4,  // Ukuran preview tetromino
  detectDevice() {
    return !!navigator.maxTouchPoints ? 'mobile' : 'computer';  // Mendeteksi perangkat yang digunakan (mobile atau komputer)
  },
  gameMode: {
    enduro: {
      increaseSpeedValue: 1,  // Nilai peningkatan kecepatan setiap 10 baris
      linesToIncreaseSpeed: 10,  // Setiap 10 baris, kecepatan permainan bertambah
      initSpeed: 3,  // Kecepatan awal permainan pada mode enduro
      display() {
        document.getElementById('timerBox').classList.add('hide');  // Menyembunyikan tampilan timer
        document.getElementById('timerTitle').classList.add('hide');  // Menyembunyikan judul timer
        document.getElementById('scoreBox').classList.remove('hide');  // Menampilkan tampilan skor
        document.getElementById('scoreTitle').classList.remove('hide');  // Menampilkan judul skor
      },
      init() {
        game.speed = this.initSpeed;  // Menetapkan kecepatan permainan
        this.display();  // Memperbarui tampilan
        sounds.playingTheme = sounds.theme1;  // Memilih musik tema permainan
      },
      start() {
        console.log('memulai mode enduro');
      },
      pause() {
        // Tidak ada timer untuk mode ini
        return false;
      },
      lineCheck(lineToDelete) {
        // Meningkatkan kecepatan setiap sepuluh baris
        const speedShouldIncrease = lineToDelete.some((x, index) => {
          return (game.lines + index + 1) % this.linesToIncreaseSpeed === 0 && game.lines > 0;
        });
        if (speedShouldIncrease) {
          console.log('10 baris telah dihapus, kecepatan meningkat');
          game.increaseSpeed(this.increaseSpeedValue);
        }
      },
      end() {
        // Mode enduro akan terus berlanjut sampai permainan berakhir
        return false;
      },
      displayScore() {
        display.endGame(true, 'Permainan Selesai', game.gameScore);  // Menampilkan skor akhir saat mode berakhir
      },
    },
    rush: {
      initSpeed: 6,  // Kecepatan awal untuk mode rush
      initTimer: 60,  // Waktu awal dalam detik untuk mode rush
      increaseSpeedValue: 1,  // Nilai peningkatan kecepatan setiap 5 baris
      linesToIncreaseSpeed: 5,  // Setiap 5 baris, kecepatan permainan bertambah
      display() {
        document.getElementById('timerBox').classList.remove('hide');  // Menampilkan tampilan timer
        document.getElementById('timerTitle').classList.remove('hide');  // Menampilkan judul timer
        document.getElementById('scoreBox').classList.remove('hide');  // Menampilkan tampilan skor
        document.getElementById('scoreTitle').classList.remove('hide');  // Menampilkan judul skor
      },
      init() {
        game.speed = this.initSpeed;  // Menetapkan kecepatan permainan
        timer.value = this.initTimer;  // Menetapkan waktu untuk timer
        timer.pause();  // Menjeda timer
        this.display();  // Memperbarui tampilan
        sounds.playingTheme = sounds.theme1;  // Memilih musik tema permainan
      },
      start() {
        console.log('memulai mode rush');
        timer.decrement();  // Mengurangi timer setiap detik
        timer.display();  // Menampilkan timer yang telah dikurangi
      },
      pause() {
        timer.pause();  // Menjeda timer
      },
      lineCheck(lineToDelete) {
        // Meningkatkan kecepatan setiap lima baris
        const speedShouldIncrease = lineToDelete.some((x, index) => {
          return (game.lines + index + 1) % this.linesToIncreaseSpeed === 0 && game.lines > 0;
        });
        if (speedShouldIncrease) {
          console.log('5 baris telah dihapus, kecepatan meningkat');
          game.increaseSpeed(this.increaseSpeedValue);
        }
      },
      end() {
        if (timer.value <= 0) {
          console.log('waktu habis!');
          timer.pause();  // Menjeda timer ketika waktu habis
          game.stop();  // Menghentikan permainan
          game.gameStatut = 'end';  // Menandakan permainan selesai
          console.log('Permainan Selesai');
          return true;
        }
        return false;
      },
      displayScore() {
        display.endGame(true, 'TIME OUT!', game.gameScore, 'poin');  // Menampilkan pesan waktu habis dengan skor
      },
    },
    sprint: {
      initSpeed: 6,  // Kecepatan awal untuk mode sprint
      increaseSpeedValue: 1,  // Nilai peningkatan kecepatan setiap 5 baris
      linesToIncreaseSpeed: 5,  // Setiap 5 baris, kecepatan permainan bertambah
      initTimer: 0,  // Timer dimulai dari 0 detik
      linesToWin: 20,  // Jumlah baris yang harus diselesaikan untuk menang

      display() {
        document.getElementById('timerBox').classList.remove('hide');  // Menampilkan tampilan timer
        document.getElementById('timerTitle').classList.remove('hide');  // Menampilkan judul timer
        document.getElementById('scoreBox').classList.add('hide');  // Menyembunyikan tampilan skor
        document.getElementById('scoreTitle').classList.add('hide');  // Menyembunyikan judul skor
      },
      init() {
        game.speed = this.initSpeed;  // Menetapkan kecepatan permainan
        timer.value = this.initTimer;  // Menetapkan timer ke 0 detik
        timer.pause();  // Menjeda timer
        this.display();  // Memperbarui tampilan
        sounds.playingTheme = sounds.theme1;  // Memilih musik tema permainan
      },
      start() {
        console.log('memulai mode sprint');
        timer.increment();  // Menghitung mundur timer
        timer.display();  // Menampilkan timer yang dihitung mundur
      },
      pause() {
        timer.pause();  // Menjeda timer
      },
      lineCheck(lineToDelete) {
        // Meningkatkan kecepatan setiap lima baris
        const speedShouldIncrease = lineToDelete.some((x, index) => {
          return (game.lines + index + 1) % this.linesToIncreaseSpeed === 0 && game.lines > 0;
        });
        if (speedShouldIncrease) {
          console.log('5 baris telah dihapus, kecepatan meningkat');
          game.increaseSpeed(this.increaseSpeedValue);
        }
      },
      end() {
        if (game.lines >= this.linesToWin) {
          console.log('selesai! jumlah baris tercapai');
          timer.pause();  // Menjeda timer
          game.stop();  // Menghentikan permainan
          game.gameStatut = 'end';  // Menandakan permainan selesai
          console.log('Permainan Selesai');
          return true;
        }
        return false;
      },
      displayScore() {
        display.endGame(true, `${this.linesToWin} LINES DONE!`, timer.value, 'detik');  // Menampilkan pesan kemenangan dengan jumlah baris yang terselesaikan
      },
    },
  },
};
