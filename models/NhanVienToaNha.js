const mongoose = require('mongoose');

const NhanVienToaNhaSchema = new mongoose.Schema({
  maNhanVien: { type: String },
  ten: { type: String },
  ngaySinh: { type: Date },
  diaChi: { type: String },
  soDienThoai: { type: String },
  bac: { type: String },
  viTri: { type: String },
}, { collection: 'NhanVienToaNha' }); // Chỉ định tên collection

module.exports = mongoose.models.NhanVienToaNha || mongoose.model('NhanVienToaNha', NhanVienToaNhaSchema);
