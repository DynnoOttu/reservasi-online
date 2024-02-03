const mongoose = require("mongoose");

const pemeriksaanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  dokter: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dokter",
    },
  tanggal: { type: String },
  jam: { type: String },
  keterangan: { type: String },
  status: { type: String },
});

const Pemeriksaan = mongoose.model("Pemeriksaan", pemeriksaanSchema);

module.exports = Pemeriksaan;
