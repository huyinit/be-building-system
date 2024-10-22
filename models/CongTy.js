const mongoose = require('mongoose');

const CongTySchema = new mongoose.Schema({
  ten: { type: String, required: true },
  maSoThue: { type: String },
  vonDieuLe: { type: Number },
  linhVuc: { type: String },
  soNhanVien: { type: Number },
  diaChiVanPhong: { type: String },
  soDienThoai: { type: String },
  dienTich: { type: Number }
}, { collection: 'CongTy' }); // Chỉ định tên collection

module.exports = mongoose.models.CongTy || mongoose.model('CongTy', CongTySchema);
