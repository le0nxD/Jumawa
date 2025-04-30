import { game } from './game';
import { tetromino } from './tetrominoes';

let keys = {
  left: 37,  // Tombol kiri
  right: 39,  // Tombol kanan
  down: 40,  // Tombol bawah
  smackDown: 38,  // Tombol atas (smackDown)
  rotLeft: 65,  // Tombol untuk rotasi kiri
  rotRight: 90,  // Tombol untuk rotasi kanan
  save: 69,  // Tombol untuk menyimpan tetromino
};

export const inputs = {
  // Menangani input dari tombol keyboard
  handleKeyPress(e) {
    if (game.gameStatut === 'play') {  // Memastikan permainan sedang berlangsung
      if (e.keyCode === keys.left) {
        tetromino.moveLeft();  // Menggerakkan tetromino ke kiri
      }
      if (e.keyCode === keys.right) {
        tetromino.moveRight();  // Menggerakkan tetromino ke kanan
      }
      if (e.keyCode === keys.down) {
        tetromino.pushDown();  // Menurunkan tetromino
      }
      if (e.keyCode === keys.smackDown) {
        tetromino.smackDown();  // Menjatuhkan tetromino langsung ke bawah
      }
      if (e.keyCode === keys.rotLeft) {
        tetromino.rotateTetromino('left');  // Memutar tetromino ke kiri
      }
      if (e.keyCode === keys.rotRight) {
        tetromino.rotateTetromino('right');  // Memutar tetromino ke kanan
      }
      if (e.keyCode === keys.save) {
        game.saveTetromino();  // Menyimpan tetromino
      }
    }
  },

  // Menangani input dari kontrol sentuh
  handleTouchPress(e) {
    if (game.gameStatut === 'play') {  // Memastikan permainan sedang berlangsung
      console.log(e.target.id);  // Mencetak id elemen yang diklik
      if (e.target.id === 'controlRight') {
        tetromino.moveRight();  // Menggerakkan tetromino ke kanan
      }
      if (e.target.id === 'controlLeft') {
        tetromino.moveLeft();  // Menggerakkan tetromino ke kiri
      }
      if (e.target.id === 'controlDown') {
        tetromino.pushDown();  // Menurunkan tetromino
      }
      if (e.target.id === 'controlUp') {
        tetromino.smackDown();  // Menjatuhkan tetromino langsung ke bawah
      }
      if (e.target.id === 'controlRotRight') {
        tetromino.rotateTetromino('right');  // Memutar tetromino ke kanan
      }
      if (e.target.id === 'controlRotLeft') {
        tetromino.rotateTetromino('left');  // Memutar tetromino ke kiri
      }
      if (e.target.id === 'controlSave') {
        game.saveTetromino();  // Menyimpan tetromino
      }
    }
  },

  // Menangani klik tombol start
  handleStart() {
    game.start();  // Memulai permainan
  },

  // Menangani klik tombol reset
  handleReset() {
    game.reset();  // Mengatur ulang permainan
  },

  // Menangani klik tombol kembali ke menu
  handleBackMenu() {
    game.backMenu();  // Kembali ke menu utama
  },

  // Fungsi untuk menetapkan listener event
  setListener(bool) {
    if (bool) {
      console.log('menetapkan listener event');
      document
        .getElementById('touchControlContainer')
        .addEventListener('click', this.handleTouchPress);  // Menambahkan listener untuk kontrol sentuh
      document.getElementById('resetButton').addEventListener('click', this.handleReset);  // Menambahkan listener untuk tombol reset
      document.getElementById('startButton').addEventListener('click', this.handleStart);  // Menambahkan listener untuk tombol start
      document.getElementById('backMenu').addEventListener('click', this.handleBackMenu);  // Menambahkan listener untuk tombol kembali ke menu
      document.addEventListener('keydown', this.handleKeyPress);  // Menambahkan listener untuk event keydown (keyboard)
    } else {
      console.log('menghapus listener event');
      document
        .getElementById('touchControlContainer')
        .removeEventListener('click', this.handleTouchPress);  // Menghapus listener untuk kontrol sentuh
      document.getElementById('resetButton').removeEventListener('click', this.handleReset);  // Menghapus listener untuk tombol reset
      document.getElementById('startButton').removeEventListener('click', this.handleReset);  // Menghapus listener untuk tombol start
      document.getElementById('backMenu').removeEventListener('click', this.handleReset);  // Menghapus listener untuk tombol kembali ke menu
      document.removeEventListener('keydown', this.handleKeyPress);  // Menghapus listener untuk event keydown (keyboard)
    }
  },
};
