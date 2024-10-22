const mongoose = require('mongoose');

const NhatKyRaVaoSchema = new mongoose.Schema({
  nhanVienId: { type: mongoose.Schema.Types.ObjectId, ref: 'NhanVienCongTy' },
  thoiGian: { type: Date },
  viTri: { type: String }
}, { collection: 'NhatKyRaVao' }); // Chỉ định tên collection

module.exports = mongoose.models.NhatKyRaVao || mongoose.model('NhatKyRaVao', NhatKyRaVaoSchema);
