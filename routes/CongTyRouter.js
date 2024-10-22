const express = require("express");
const CongTy = require("../models/CongTy"); // Import model Post
const CongTyDichVu = require("../models/CongTyDichVu"); // Import model Post

const router = express.Router();


// Endpoint GET để trả về tất cả các công ty
router.get('/congty', async (req, res) => {
    try {
        const congTys = await CongTy.find({}); // Lấy tất cả các công ty từ MongoDB
        res.send(congTys); // Trả về danh sách các công ty
    } catch (error) {
        res.status(500).send({ error: error.message }); // Trả về lỗi nếu có
    }
});


// Endpoint GET để trả về một công ty theo ID
router.get('/congty/:id', async (req, res) => {
    try {
        const congTy = await CongTy.findById(req.params.id); // Tìm công ty theo ID
        if (!congTy) return res.status(404).send({ error: 'Công ty không tìm thấy!' });
        res.send(congTy); // Trả về công ty
    } catch (error) {
        res.status(500).send({ error: error.message }); // Trả về lỗi nếu có
    }
});

// Endpoint POST để tạo một công ty mới
router.post('/congty', async (req, res) => {
    const congTy = new CongTy({
        ten: req.body.ten ?? "",
        maSoThue: req.body.maSoThue ?? "",
        vonDieuLe: req.body.vonDieuLe ?? 0,
        linhVuc: req.body.linhVuc ?? "",
        soNhanVien: req.body.soNhanVien ?? 0,
        diaChiVanPhong: req.body.diaChiVanPhong ?? "",
        soDienThoai: req.body.soDienThoai ?? "",
        dienTich: req.body.dienTich ?? 0
      });
      
    try {
      const newCongTy = await congTy.save();
      res.status(201).json(newCongTy);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  


// Endpoint PUT để cập nhật một công ty theo ID
router.put('/congty/:id', async (req, res) => {
    try {
        const congTy = await CongTy.findById(req.params.id);
        if (!congTy) return res.status(404).json({ message: 'Công ty không tồn tại' });
    
        congTy.ten = req.body.ten || congTy.ten;
        congTy.maSoThue = req.body.maSoThue || congTy.maSoThue;
        congTy.vonDieuLe = req.body.vonDieuLe || congTy.vonDieuLe;
        congTy.linhVuc = req.body.linhVuc || congTy.linhVuc;
        congTy.soNhanVien = req.body.soNhanVien || congTy.soNhanVien;
        congTy.diaChiVanPhong = req.body.diaChiVanPhong || congTy.diaChiVanPhong;
        congTy.soDienThoai = req.body.soDienThoai || congTy.soDienThoai;
        congTy.dienTich = req.body.dienTich || congTy.dienTich;
    
        const updatedCongTy = await congTy.save();
        res.json(updatedCongTy);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });

// Endpoint DELETE để xóa một công ty theo ID
router.delete('/congty/:id', async (req, res) => {
    try {
        const congTy = await CongTy.findByIdAndDelete(req.params.id);
        if (!congTy) return res.status(404).send({ error: 'Công ty không tìm thấy!' });
        res.send({ message: 'Công ty đã được xóa thành công!' }); // Trả về thông báo thành công
    } catch (error) {
        res.status(500).send({ error: error.message }); // Trả về lỗi nếu có
    }
});


/*
Các chức năng khác : viết làm phong phú thêm


*/



// Tìm kiếm công ty theo tên hoặc mã số thuế
router.get('/congty/search', async (req, res) => {
    const { ten, maSoThue } = req.query;
    try {
        const congTys = await CongTy.find({
            $or: [
                { ten: new RegExp(ten, 'i') },
                { maSoThue: maSoThue }
            ]
        });
        res.send(congTys);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Lấy danh sách công ty có vốn điều lệ lớn nhất
router.get('/congty/top', async (req, res) => {
    try {
        const topCongTys = await CongTy.find({}).sort({ vonDieuLe: -1 }).limit(10); // Lấy 10 công ty có vốn lớn nhất
        res.send(topCongTys);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});



// tính tổng chi phí dịch vụ cho một công ty dựa trên số tháng họ đã đăng ký trong năm.
router.get('/congty/:congTyId/tinhchi-phi/:thangBatDau/:thangKetThuc', async (req, res) => {
    try {
        const { congTyId, thangBatDau, thangKetThuc } = req.params;

        // Lấy thông tin công ty và dịch vụ
        const congTy = await CongTyDichVu.findById(congTyId).populate('dichVuSuDung.dichVuId');
        if (!congTy) {
            return res.status(404).send({ error: "Không tìm thấy công ty!" });
        }

        // Tính tổng chi phí dịch vụ
        const tongChiPhi = await tinhTongChiPhiDichVu(congTy);

        // Tính tiền theo số tháng đăng ký
        const chiPhiTheoThang = tinhTienTheoThang(tongChiPhi, thangBatDau, thangKetThuc);

        res.send({ tongChiPhi, chiPhiTheoThang });

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


// endpoint để thêm, cập nhật, và xóa dịch vụ mà công ty đang sử dụng'
router.post('/congty/:congTyId/add-service', async (req, res) => {
    try {
        const { congTyId } = req.params;
        const { dichVuId } = req.body;

        const congTy = await CongTyDichVu.findById(congTyId);
        if (!congTy) {
            return res.status(404).send({ error: "Không tìm thấy công ty!" });
        }

        congTy.dichVuSuDung.push({ dichVuId });
        await congTy.save();

        res.send({ message: "Dịch vụ đã được thêm thành công!" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});




module.exports = router;
