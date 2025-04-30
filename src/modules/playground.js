import { init } from './config';
import { sounds } from './audio';

export const playground = {
  blocks: [],  // Array yang berisi blok-blok dalam permainan
  preview: [],  // Array untuk preview tetromino
  deletingAnimation: 'init',  // Status animasi penghapusan
  setBlockWidth() {
    const width = document.documentElement.clientWidth || document.body.clientWidth;

    const tempBlockSize = Math.floor(width / (init.columns * 2.6));  // Menghitung ukuran blok berdasarkan lebar layar
    if (tempBlockSize > init.maxBlockSize) {
      init.blockSize = init.maxBlockSize;  // Menetapkan ukuran blok maksimal
    } else if (tempBlockSize < init.minBlockSize) {
      init.blockSize = init.minBlockSize;  // Menetapkan ukuran blok minimal
    } else {
      init.blockSize = tempBlockSize;  // Menetapkan ukuran blok sementara
    }
  },
  generatePlaygroundGrid() {
    this.setBlockWidth();
    console.log('menghasilkan blok playground');
    const playground = document.getElementById('playground');
    const root = document.querySelector('html');
    root.style.setProperty('--columns', init.columns);  // Menetapkan jumlah kolom
    root.style.setProperty('--rows', init.rows);  // Menetapkan jumlah baris
    root.style.setProperty('--block-width', init.blockSize + 'px');  // Menetapkan lebar blok
    const numberOfBlocks = init.rows * init.columns;  // Menghitung jumlah blok berdasarkan kolom dan baris
    for (let i = 0; i < numberOfBlocks; i++) {
      let div = document.createElement('div');
      div.className = 'playgroundBlock';  // Membuat elemen div untuk blok
      init.devMode ? (div.innerHTML = i) : null;  // Menampilkan nomor blok jika mode pengembangan diaktifkan
      playground.appendChild(div);  // Menambahkan blok ke elemen playground
    }
    for (let i = 0; i < init.columns; i++) {
      let div = document.createElement('div');
      div.className = 'playgroundBottom taken';  // Membuat bagian bawah playground
      playground.appendChild(div);
    }
    this.blocks = Array.from(document.querySelectorAll('.grid div'));  // Menyimpan blok-blok yang telah dibuat
    console.log(`${numberOfBlocks} blok telah dihasilkan`);
  },
  generatePreviewGrid() {
    console.log('menghasilkan blok preview');
    const preview = document.getElementById('nextTetrominoBox');
    const numberOfBlocks = Math.pow(init.previewSize, 2);  // Menghitung jumlah blok berdasarkan ukuran preview
    for (let i = 0; i < numberOfBlocks; i++) {
      let div = document.createElement('div');
      div.className = 'playgroundBlock';
      init.devMode ? (div.innerHTML = i) : null;
      preview.appendChild(div);
    }
    this.preview = Array.from(document.querySelectorAll('#nextTetrominoBox div'));  // Menyimpan blok preview
    console.log(`${numberOfBlocks} blok telah dihasilkan untuk preview`);
  },
  generateSavedGrid() {
    console.log('menghasilkan blok saved');
    const saved = document.getElementById('savedTetrominoBox');
    const numberOfBlocks = Math.pow(init.previewSize, 2);  // Menghitung jumlah blok untuk slot penyimpanan
    for (let i = 0; i < numberOfBlocks; i++) {
      let div = document.createElement('div');
      div.className = 'playgroundBlock';
      init.devMode ? (div.innerHTML = i) : null;
      saved.appendChild(div);
    }
    this.saved = Array.from(document.querySelectorAll('#savedTetrominoBox div'));  // Menyimpan blok yang disimpan
    console.log(`${numberOfBlocks} blok telah dihasilkan untuk slot penyimpanan`);
  },
  generateAllGrid() {
    this.generatePlaygroundGrid();  // Menghasilkan grid playground
    this.generatePreviewGrid();  // Menghasilkan grid preview
    this.generateSavedGrid();  // Menghasilkan grid untuk penyimpanan tetromino
  },
  cleanPreviewGrid() {
    this.preview.forEach((index) => (index.className = 'playgroundBlock'));  // Membersihkan grid preview
  },
  cleanSavedGrid() {
    this.saved.forEach((index) => (index.className = 'playgroundBlock'));  // Membersihkan grid untuk slot penyimpanan
  },
  removeGrid(id) {
    const playgroundToClean = document.getElementById(id);
    while (playgroundToClean.firstChild) {
      playgroundToClean.removeChild(playgroundToClean.firstChild);  // Menghapus semua anak dari grid
    }
  },
  removeAllGrid() {
    console.log('menghapus semua grid');
    this.removeGrid('nextTetrominoBox');  // Menghapus grid preview
    this.removeGrid('savedTetrominoBox');  // Menghapus grid penyimpanan
    this.removeGrid('playground');  // Menghapus grid utama
  },
  cleanAllGrid() {
    console.log('membersihkan semua grid');
    this.removeGrid('playground');  // Menghapus grid utama
    this.cleanPreviewGrid();  // Membersihkan grid preview
    this.cleanSavedGrid();  // Membersihkan grid penyimpanan
  },
  lineIsMade() {
    let checkLine = [];
    let lineToDelete = [];
    for (let i = 0; i < init.columns; i++) {
      checkLine.push(i);  // Membuat array untuk memeriksa setiap kolom
    }
    for (let i = 0; i < init.rows; i++) {
      const lineTaken = checkLine.every((index) => {
        return (
          this.blocks[i * init.columns + index].classList.contains('taken') ||
          this.blocks[i * init.columns + index].classList.contains('tetromino')
        );
      });
      lineTaken ? lineToDelete.push(i) : null;  // Menandai baris yang lengkap untuk dihapus
    }
    lineToDelete.length ? console.log('baris lengkap', lineToDelete) : 0;
    return lineToDelete;
  },
  animateDeleteLine(lineToDelete) {
    if (lineToDelete.length === 4) {
      sounds.play(sounds.tetris);  // Memainkan suara Tetris jika 4 baris terhapus
      for (let i = 0; i < init.columns; i++) {
        lineToDelete.forEach(
          (index) =>
            (this.blocks[init.columns * index + i].className =
              'playgroundBlock taken specialErasing')  // Animasi penghapusan khusus
        );
      }
    } else {
      sounds.play(sounds.line);  // Memainkan suara garis biasa jika kurang dari 4 baris
      for (let i = 0; i < init.columns; i++) {
        lineToDelete.forEach(
          (index) =>
            (this.blocks[init.columns * index + i].className = 'playgroundBlock taken erasing')  // Animasi penghapusan biasa
        );
      }
    }
  },
  deleteLine(lineArray) {
    for (let j = 0; j < lineArray.length; j++) {
      let saveUpperBlockStyle = [];
      console.log(`menghapus baris ${lineArray[j]}`);
      for (let i = 0; i < lineArray[j] * init.columns; i++) {
        saveUpperBlockStyle.push(this.blocks[i].className);  // Menyimpan gaya blok yang ada
        this.blocks[i].className = 'playgroundBlock';  // Menghapus blok
      }
      for (let i = 0; i < lineArray[j] * init.columns; i++) {
        let bottomCheck = this.blocks[i + init.columns].className;
        !bottomCheck.includes('playgroundBottom')
          ? (this.blocks[i + init.columns].className = saveUpperBlockStyle[i])  // Memulihkan gaya blok di bawahnya
          : null;
      }
    }
  },
};
