const mongoose = require('mongoose');

const CongTyDichVuSchema = new mongoose.Schema({
  congTyId: { type: mongoose.Schema.Types.ObjectId, ref: 'CongTy' },
  nam: { type: Number },
  thang: { type: Number },
  soNhanVien: { type: Number },
  dienTich: { type: Number },
  tongChiPhi: { type: Number },
  dichVuSuDungId: [ {
    type: mongoose.Schema.Types.ObjectId, ref: 'DichVu' 
  }]
}, { collection: 'CongTyDichVu' }); // Chỉ định tên collection

// Thêm chỉ mục kết hợp cho congTyId, nam, thang
CongTyDichVuSchema.index({ congTyId: 1, nam: 1, thang: 1 }, { unique: true });

module.exports = mongoose.models.CongTyDichVu || mongoose.model('CongTyDichVu', CongTyDichVuSchema);
