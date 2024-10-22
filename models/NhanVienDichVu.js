const mongoose = require('mongoose');

const NhanVienDichVuSchema = new mongoose.Schema({
  nhanVienId: { type: mongoose.Schema.Types.ObjectId, ref: 'NhanVienToaNha' }, // Tham chiếu đến nhân viên
  nam: { type: Number, required: true },
  thang: { type: Number, required: true },
  luong: { type: Number, required: true },
  danhSachDichVu: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DichVu' }]
}, { collection: 'NhanVienDichVu' });

// Đảm bảo năm + tháng là unique cho mỗi nhân viên
NhanVienDichVuSchema.index({ nhanVienId: 1, nam: 1, thang: 1 }, { unique: true });

module.exports = mongoose.models.LuongHangThang || mongoose.model('NhanVienDichVu', NhanVienDichVuSchema);