const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',  // Menentukan file masuk (entry point) dari aplikasi
  output: {
    filename: 'main.js',  // Menentukan nama file hasil output
    path: path.resolve(__dirname, 'dist'),  // Menentukan lokasi folder output, dalam hal ini 'dist'
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.css$/i,  // Aturan untuk memproses file CSS
  //       use: ['style-loader', 'css-loader'],  // Menggunakan loader untuk memuat file CSS
  //     },
  //   ],
  // },

  optimization: {
    minimizer: [
      new TerserPlugin({
        sourceMap: true, // Harus diatur ke true jika menggunakan source-maps pada produksi
        terserOptions: {
          compress: {
            drop_console: true,  // Menghapus pernyataan console.log di kode produksi
          },
        },
      }),
    ],
  },
  mode: 'production',  // Mode produksi untuk mengoptimalkan build
};
