import { init } from './config';

export const timer = {
  value: 0,  // Nilai timer
  timerCount: 0,  // ID untuk interval penghitungan timer
  timerDisplay: 0,  // ID untuk interval tampilan timer
  display() {
    this.timerDisplay = setInterval(() => {
      let valueToDisplay;
      this.value <= 0 ? (valueToDisplay = 0) : (valueToDisplay = Math.round(this.value));  // Menentukan nilai yang akan ditampilkan
      document.getElementById('timer').innerHTML = valueToDisplay;  // Memperbarui elemen timer di HTML
    }, init.timerDisplayPrecision);  // Interval pembaruan tampilan timer
  },
  increment() {
    this.timerCount = setInterval(() => {
      this.value += init.timerCountPrecision / 1000;  // Menambahkan nilai pada timer setiap interval
      this.value = Math.round(this.value * 1000) / 1000;  // Membulatkan nilai timer ke tiga angka desimal
    }, init.timerCountPrecision);  // Interval peningkatan nilai timer
  },
  decrement() {
    this.timerCount = setInterval(() => {
      this.value -= init.timerCountPrecision / 1000;  // Mengurangi nilai timer setiap interval
      this.value = Math.round(this.value * 1000) / 1000;  // Membulatkan nilai timer ke tiga angka desimal
    }, init.timerCountPrecision);  // Interval pengurangan nilai timer
  },
  pause() {
    console.log('menjeda timer');
    console.log('penghitungan timer', this.timerCount);  // Menampilkan ID interval penghitungan timer
    clearInterval(this.timerCount);  // Menghentikan interval penghitungan timer
    clearInterval(this.timerDisplay);  // Menghentikan interval tampilan timer
  },
  // reset() {
  //   console.log('mengatur ulang timer');
  //   clearInterval(this.timerCount);  // Menghentikan interval penghitungan timer
  //   clearInterval(this.timerDisplay);  // Menghentikan interval tampilan timer
  // },
};
