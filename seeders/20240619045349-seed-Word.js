"use strict";
let data = require("../words.json");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    data = data.map((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
      return el;
    });
    await queryInterface.bulkInsert("Words", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Words", null, {});
  },
};
