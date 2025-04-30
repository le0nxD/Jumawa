//----------------------------------//
//------------ TETRIS JUMAWA 4 ------------//
//----------------------------------//

//---------------------------------------------------------

/////////////
// IMPOR //
/////////////

import { menu } from './modules/menu';  // Mengimpor modul menu
import { init } from './modules/config';  // Mengimpor modul konfigurasi
import { display } from './modules/display';  // Mengimpor modul tampilan
import { sounds } from './modules/audio';  // Mengimpor modul suara
import { game } from './modules/game';  // Mengimpor modul permainan

//---------------------------------------------------------

//////////////////
// SCRIPT INISIALISASI //
//////////////////

// Menambahkan event listener pada tombol-tombol menu untuk memilih mode permainan
document.getElementById('enduranceMode').addEventListener('click', () => menu.enduranceMode());
document.getElementById('rushMode').addEventListener('click', () => menu.rushMode());
document.getElementById('sprintMode').addEventListener('click', () => menu.sprintMode());

// Mengontrol pengaturan musik ketika switch diubah
document.getElementById('musicSwitch').addEventListener('change', function () {
  if (this.checked) {  // Jika switch diaktifkan
    sounds.enableMusic(true);  // Mengaktifkan musik
    game.gameStatut === 'play' ? sounds.playSong(sounds.theme1) : null;  // Memainkan musik tema jika permainan dimulai
  } else {  // Jika switch dimatikan
    sounds.enableMusic(false);  // Menonaktifkan musik
    sounds.stop(sounds.theme1);  // Menghentikan musik
  }
});

// Memeriksa apakah perangkat adalah mobile atau tidak, dan mengatur pengaturan tampilan sentuh
init.detectDevice() === 'mobile' ? (display.tactil = true) : (display.tactil = false);

//---------------------------------------------------------
