const mongoose = require("mongoose");

const dokterSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  spesialis: { type: String, required: true },
  tanggal: { type: String, required: true },
  jam: { type: String, required: true },
});

const Dokter = mongoose.model("Dokter", dokterSchema);

module.exports = Dokter;
