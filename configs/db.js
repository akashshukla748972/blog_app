const mongoose = require("mongoose");

const connectToDb = async (link) => {
  return await mongoose.connect(link);
};

module.exports = connectToDb;
