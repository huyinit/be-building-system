const mongoose = require('mongoose');

const DichVuSchema = new mongoose.Schema({
  ten: { type: String },
  loai: { type: String },
  giaThueDichVu: { type: Number }, //công ty thuê mất tiền
  giaLamDichVu: { type: Number } // nhân viên tòa nhà làm được tiền
}, { collection: 'DichVu' }); // Chỉ định tên collection

module.exports = mongoose.models.DichVu || mongoose.model('DichVu', DichVuSchema);
