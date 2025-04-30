import { init } from './config';
import { playground } from './playground';
import { game } from './game';
import { sounds } from './audio';

export const tetromino = {
  number: 0,  // Nomor tetromino saat ini
  position: 0,  // Posisi tetromino saat ini
  rotation: 0,  // Rotasi tetromino saat ini
  current: [],  // Tetromino yang sedang aktif
  canBeSaved: true,  // Menandakan apakah tetromino dapat disimpan
  canMoveDown: true,  // Menandakan apakah tetromino dapat bergerak ke bawah
  saved: {},  // Tetromino yang telah disimpan
  next: {},  // Tetromino yang akan datang
  theTetrominoes: [],  // Daftar bentuk tetromino
  theTetrominoesPreview: [],  // Daftar bentuk preview tetromino

  // Membuat bentuk-bentuk tetromino
  createTetrominoes(columns) {
    const iTetromino = [
      [1, columns + 1, columns * 2 + 1, columns * 3 + 1],
      [0, 1, 2, 3],
      [1, columns + 1, columns * 2 + 1, columns * 3 + 1],
      [0, 1, 2, 3],
    ];
    const llTetromino = [
      [0, columns, columns + 1, columns + 2],
      [1, 2, columns + 1, columns * 2 + 1],
      [0, 1, 2, columns + 2],
      [1, columns + 1, columns * 2, columns * 2 + 1],
    ];
    const lrTetromino = [
      [2, columns, columns + 1, columns + 2],
      [1, columns + 1, columns * 2 + 1, columns * 2 + 2],
      [0, 1, 2, columns],
      [0, 1, columns + 1, columns * 2 + 1],
    ];
    const oTetromino = [
      [1, 2, columns + 1, columns + 2],
      [1, 2, columns + 1, columns + 2],
      [1, 2, columns + 1, columns + 2],
      [1, 2, columns + 1, columns + 2],
    ];
    const sTetromino = [
      [1, 2, columns, columns + 1],
      [1, columns + 1, columns + 2, columns * 2 + 2],
      [1, 2, columns, columns + 1],
      [1, columns + 1, columns + 2, columns * 2 + 2],
    ];
    const zTetromino = [
      [0, 1, columns + 1, columns + 2],
      [2, columns + 1, columns + 2, columns * 2 + 1],
      [0, 1, columns + 1, columns + 2],
      [2, columns + 1, columns + 2, columns * 2 + 1],
    ];
    const tTetromino = [
      [1, columns, columns + 1, columns + 2],
      [1, columns + 1, columns + 2, columns * 2 + 1],
      [0, 1, 2, columns + 1],
      [2, columns + 1, columns + 2, columns * 2 + 2],
    ];

    return [iTetromino, llTetromino, lrTetromino, oTetromino, sTetromino, zTetromino, tTetromino];
  },

  // Menginisialisasi bentuk tetromino yang akan datang
  initPreview() {
    const number = Math.floor(Math.random() * this.theTetrominoes.length);
    const rotation = Math.floor(Math.random() * this.theTetrominoes[this.number].length);
    const tetromino = this.theTetrominoesPreview[number][rotation];
    this.next = {
      number,
      rotation,
      tetromino,
    };
  },

  // Menginisialisasi tetromino yang telah disimpan
  initSaved() {
    this.saved = {
      number: 0,
      rotation: 0,
      tetromino: [],
    };
  },

  // Menginisialisasi tetromino baru
  initTetromino() {
    console.log('inisialisasi tetromino baru');
    if (game.gameStatut === 'notStarted') {
      this.theTetrominoes = this.createTetrominoes(init.columns);
      this.theTetrominoesPreview = this.createTetrominoes(init.previewSize);
      this.initPreview();
    }

    this.number = this.next.number;
    this.rotation = this.next.rotation;
    this.position = Math.floor(init.columns / 2 - 1);
    this.canBeSaved = true;
    this.canMoveDown = true;

    this.initPreview();

    console.log('nomor tetromino', this.number);
    this.current = this.theTetrominoes[this.number][this.rotation];
  },

  // Menyimpan tetromino
  saveTetromino() {
    console.log('menyimpan tetromino');
    this.saved = {
      number: this.number,
      rotation: this.rotation,
      tetromino: this.theTetrominoesPreview[this.number][this.rotation],
    };
  },

  // Menukar tetromino yang disimpan
  switchSaved() {
    const wasSaved = this.saved;
    this.saveTetromino();
    this.number = wasSaved.number;
    this.rotation = wasSaved.rotation;
    this.current = this.theTetrominoes[this.number][this.rotation];
    this.position = Math.floor(init.columns / 2 - 1);
    this.canBeSaved = false;
    this.canMoveDown = true;
  },

  // Memutar tetromino
  rotateTetromino(direction) {
    let tempRotationIndex = this.rotation;
    direction === 'right' ? tempRotationIndex++ : tempRotationIndex--;
    tempRotationIndex >= this.theTetrominoes[this.number].length ? (tempRotationIndex = 0) : null;
    tempRotationIndex < 0 ? (tempRotationIndex = this.theTetrominoes[this.number].length - 1) : null;

    const tempTetromino = this.theTetrominoes[this.number][tempRotationIndex];
    const willTouchLimits = tempTetromino.some((index) => {
      return playground.blocks[this.position + index + init.columns].classList.contains('taken');
    });

    const isAtRightEdge = tempTetromino.some((index) => {
      return (index + this.position) % init.columns === 0;
    });

    const isAtLeftEdge = tempTetromino.some((index) => {
      return (index + this.position + 1) % init.columns === 0;
    });
    if (willTouchLimits || (isAtRightEdge && isAtLeftEdge)) {
      console.log('rotasi tidak mungkin karena benturan batas');
    } else {
      sounds.play(sounds.rotate);
      console.log('memutar tetromino ke arah ' + direction);
      this.undraw();
      this.current = tempTetromino;
      this.rotation = tempRotationIndex;
      this.draw();
    }
  },

  // Menampilkan preview tetromino berikutnya
  drawPreview() {
    console.log('menampilkan preview tetromino');
    playground.cleanPreviewGrid();
    this.next.tetromino.forEach((index) => {
      playground.preview[index].classList.add('tetromino');
      playground.preview[index].classList.add('colorT' + this.next.number.toString());
    });
  },

  // Menampilkan tetromino yang disimpan
  drawSaved() {
    console.log('menampilkan tetromino yang disimpan');
    playground.cleanSavedGrid();
    this.saved.tetromino.forEach((index) => {
      playground.saved[index].classList.add('tetromino');
      playground.saved[index].classList.add('colorT' + this.saved.number.toString());
    });
  },

  // Menampilkan tetromino saat ini di layar
  draw() {
    this.current.forEach((index) => {
      playground.blocks[this.position + index].classList.add('tetromino');
      playground.blocks[this.position + index].classList.add('colorT' + this.number.toString());
    });
  },

  // Menggambar tetromino baru
  drawNew() {
    this.initTetromino();
    this.draw();
    this.drawPreview();
  },

  // Menghapus tetromino saat ini dari layar
  undraw() {
    this.current.forEach((index) => {
      playground.blocks[this.position + index].className = 'playgroundBlock';
    });
  },

  // Memindahkan tetromino ke bawah
  moveDown() {
    this.undraw();
    this.position += init.columns;
    this.draw();
  },

  // Menjatuhkan tetromino hingga mencapai batas
  smackDown() {
    console.log('menjatuhkan tetromino');
    if (this.canMoveDown) {
      this.undraw();
      while (!this.freeze()) {
        this.position += init.columns;
      }
      sounds.play(sounds.smack);
      sounds.justSmashed = true;
      this.draw();
    } else {
      console.log(`tetromino tidak bisa turun lebih dalam`); 
    }
  },

  // Memindahkan tetromino ke kiri
  moveLeft() {
    const isAtLeftEdge = this.current.some((index) => {
      return (index + this.position) % init.columns === 0;
    });
    if (!isAtLeftEdge && !this.lateralBlock('left')) {
      console.log('memindahkan tetromino ke kiri');
      sounds.play(sounds.move);
      this.undraw();
      this.position--;
      this.draw();
    } else {
      console.log('batas kiri mencegah pergerakan tetromino');
    }
  },

  // Memindahkan tetromino ke bawah dalam satu langkah
  pushDown() {
    if (playground.deletingAnimation !== 'init') {
      return;
    }
    if (!this.freeze() && this.canMoveDown) {
      console.log('memindahkan tetromino ke bawah');
      sounds.play(sounds.move);
      this.undraw();
      this.position += init.columns;
      this.draw();
    } else {
      this.canMoveDown ? sounds.play(sounds.land) : null;
      this.canMoveDown = false;
      console.log('batas bawah mencegah pergerakan tetromino');
    }
  },

  // Memindahkan tetromino ke kanan
  moveRight() {
    const isAtRightEdge = this.current.some((index) => {
      return (index + this.position + 1) % init.columns === 0;
    });
    if (!isAtRightEdge && !this.lateralBlock('right')) {
      console.log('memindahkan tetromino ke kanan');
      sounds.play(sounds.move);
      this.undraw();
      this.position++;
      this.draw();
    } else {
      console.log('batas kanan mencegah pergerakan tetromino');
    }
  },

  // Ketika tetromino mencapai batas bawah, ia akan berhenti dan menjadi bagian dari batas
  freeze() {
    const freezeCondition = this.current.some((index) =>
      playground.blocks[this.position + index + init.columns].classList.contains('taken')
    );
    if (freezeCondition) {
      console.log('SATU TETROMINO MENGHENTI! tetromino baru datang');
      this.canMoveDown = false;
      this.current.forEach((index) => {
        playground.blocks[index + this.position].classList.add('taken');
      });
      return true;
    }
    return false;
  },

  // Memeriksa apakah ada blok lain di sisi lateral
  lateralBlock(side) {
    let checkSide;
    side === 'right' ? (checkSide = 1) : (checkSide = -1);
    return this.current.some((index) =>
      playground.blocks[this.position + index + checkSide].classList.contains('taken')
    );
  },
};
