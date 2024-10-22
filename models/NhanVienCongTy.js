const mongoose = require('mongoose');

const NhanVienCongTySchema = new mongoose.Schema({
  congTyId: { type: mongoose.Schema.Types.ObjectId, ref: 'CongTy' },
  maNhanVien: { type: String },
  soCMT: { type: String },
  ten: { type: String },
  ngaySinh: { type: Date },
  soDienThoai: { type: String }
}, { collection: 'NhanVienCongTy' }); // Chỉ định tên collection

module.exports = mongoose.models.NhanVienCongTy || mongoose.model('NhanVienCongTy', NhanVienCongTySchema);
