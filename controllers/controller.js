const { Word } = require("../models/index");
const Sequelize = require("sequelize");

class Controller {
  static async getWords(req, res, next) {
    try {
      // Ambil semua kata-kata dari database
      const allWords = await Word.findAll();
      // Pastikan ada kata-kata yang tersedia
      if (allWords.length === 0) {
        throw new Error("No words found in the database.");
      }

      // Pilih kata secara acak menggunakan Math.random()
      const randomIndex = Math.floor(Math.random() * allWords.length);
      const randomWord = allWords[randomIndex];

      // Kirim respons dengan kata-kata yang dipilih secara acak
      res.status(200).json({
        word: randomWord.words,
        hint: randomWord.clue,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
