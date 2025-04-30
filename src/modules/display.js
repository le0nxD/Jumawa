import { game } from './game';
import { timer } from './timer';

export const display = {
  tactil: false,  // Menyimpan status apakah kontrol sentuh aktif atau tidak

  // Menampilkan atau menyembunyikan panel playground
  playgroundPanel(bool) {
    if (bool) {
      console.log('menampilkan panel playground');
      document.getElementById('sidePanelRight').classList.remove('hide');  // Menampilkan panel kanan
      document.getElementById('sidePanelLeft').classList.remove('hide');  // Menampilkan panel kiri
      document.getElementById('playgroundContainer').classList.remove('hide');  // Menampilkan area playground
    } else {
      console.log('menyembunyikan panel playground');
      document.getElementById('sidePanelRight').classList.add('hide');  // Menyembunyikan panel kanan
      document.getElementById('sidePanelLeft').classList.add('hide');  // Menyembunyikan panel kiri
      document.getElementById('playgroundContainer').classList.add('hide');  // Menyembunyikan area playground
    }
  },

  // Menampilkan atau menyembunyikan menu utama
  mainMenu(bool) {
    if (bool) {
      console.log('menampilkan menu utama');
      document.getElementById('mainMenu').classList.remove('hide');  // Menampilkan menu utama
      this.touchControl(false);  // Menonaktifkan kontrol sentuh jika menu utama ditampilkan
    } else {
      console.log('menyembunyikan menu utama');
      document.getElementById('mainMenu').classList.add('hide');  // Menyembunyikan menu utama
      this.touchControl(this.tactil);  // Mengaktifkan kembali kontrol sentuh jika sebelumnya aktif
    }
  },

  // Memperbarui informasi yang ditampilkan di panel samping (kecepatan dan timer)
  sidePanelInfo() {
    document.getElementById('speed').innerHTML = game.speed.toString();  // Menampilkan kecepatan permainan
    document.getElementById('timer').innerHTML = Math.floor(timer.value);  // Menampilkan waktu yang telah berjalan
  },

  // Menampilkan atau menyembunyikan tampilan akhir permainan
  endGame(bool, title = 'GAME OVER', score, unit) {
    const displayValue = bool ? 'flex' : 'none';  // Menentukan apakah tampilan akhir permainan harus ditampilkan atau disembunyikan
    document.getElementById('endGame').style.display = displayValue;  // Mengatur tampilan akhir permainan
    if (bool) {
      document.getElementById('endGameTitle').innerHTML = title;  // Menampilkan judul akhir permainan
      score >= 0 ? (document.getElementById('finalScore').innerHTML = score) : null;  // Menampilkan skor akhir
      unit ? (document.getElementById('scoreUnit').innerHTML = unit) : null;  // Menampilkan unit skor (misalnya "poin")
    }
  },

  // Menampilkan atau menyembunyikan tampilan pause permainan
  pause(bool) {
    const displayValue = bool ? 'block' : 'none';  // Menentukan apakah tampilan pause harus ditampilkan atau disembunyikan
    document.getElementById('gamePaused').style.display = displayValue;  // Mengatur tampilan pause
  },

  // Mengatur kontrol sentuh (menampilkan atau menyembunyikan kontrol)
  touchControl(bool) {
    if (bool) {
      document.getElementById('touchControlContainer').style.display = 'flex';  // Menampilkan kontrol sentuh
    } else {
      document.getElementById('touchControlContainer').style.display = 'none';  // Menyembunyikan kontrol sentuh
    }
  },
};
