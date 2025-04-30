import { timer } from './timer';

const { display } = require('./display');
const { game } = require('./game');
const { init } = require('./config');

export const menu = {
  // Menampilkan atau menyembunyikan menu utama dan panel playground
  showMenu(bool) {
    display.mainMenu(bool);  // Menampilkan atau menyembunyikan menu utama
    display.playgroundPanel(!bool);  // Menampilkan atau menyembunyikan panel playground
  },

  // Menjalankan mode endurance (ketahanan)
  enduranceMode() {
    this.showMenu(false);  // Menyembunyikan menu utama dan menampilkan panel playground
    game.gameMode = 'enduro';  // Menetapkan mode permainan ke 'enduro'
    game.init();  // Menginisialisasi permainan
  },

  // Menjalankan mode rush (kejar-kejaran)
  rushMode() {
    this.showMenu(false);  // Menyembunyikan menu utama dan menampilkan panel playground
    display.mainMenu(false);  // Menyembunyikan menu utama
    display.playgroundPanel(true);  // Menampilkan panel playground
    game.gameMode = 'rush';  // Menetapkan mode permainan ke 'rush'
    game.init();  // Menginisialisasi permainan
  },

  // Menjalankan mode sprint (lari)
  sprintMode() {
    this.showMenu(false);  // Menyembunyikan menu utama dan menampilkan panel playground
    display.mainMenu(false);  // Menyembunyikan menu utama
    display.playgroundPanel(true);  // Menampilkan panel playground
    game.gameMode = 'sprint';  // Menetapkan mode permainan ke 'sprint'
    game.init();  // Menginisialisasi permainan
  },
};
