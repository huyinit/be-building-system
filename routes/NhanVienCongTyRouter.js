const express = require("express");
const NhanVienCongTy = require("../models/NhanVienCongTy"); // Import model NhanVienCongTy
const CongTy = require("../models/CongTy"); // Import model CongTy

const router = express.Router();

// Endpoint GET để trả về tất cả các nhân viên công ty
router.get('/nhanviencongty', async (req, res) => {
    try {
        const nhanViens = await NhanVienCongTy.find({}) // Lấy tất cả nhân viên và populate công ty
        // const nhanViens = await NhanVienCongTy.find({}).populate('congTyId'); // Lấy tất cả nhân viên và populate công ty
        res.send(nhanViens); // Trả về danh sách nhân viên
    } catch (error) {
        res.status(500).send({ error: error.message }); // Trả về lỗi nếu có
    }
});

// Endpoint GET để trả về một nhân viên theo ID
router.get('/nhanviencongty/:id', async (req, res) => {
    try {
        const nhanVien = await NhanVienCongTy.findById(req.params.id).populate('congTyId'); // Tìm nhân viên theo ID và populate công ty
        if (!nhanVien) return res.status(404).send({ error: 'Nhân viên không tìm thấy!' });
        res.send(nhanVien); // Trả về nhân viên
    } catch (error) {
        res.status(500).send({ error: error.message }); // Trả về lỗi nếu có
    }
});

// Endpoint POST để tạo một nhân viên công ty mới
router.post('/nhanviencongty', async (req, res) => {
    try {
        // Kiểm tra xem công ty có tồn tại không
        const congTyExists = await CongTy.exists({ _id: req.body.congTyId });
        if (!congTyExists) {
            return res.status(404).send({ error: 'Công ty không tồn tại!' });
        }

        // Tạo nhân viên công ty mới
        const nhanVienCongTy = new NhanVienCongTy({
            congTyId: req.body.congTyId ?? null,
            maNhanVien: req.body.maNhanVien ?? "",
            soCMT: req.body.soCMT ?? "",
            ten: req.body.ten ?? "",
            ngaySinh: req.body.ngaySinh ?? null,
            soDienThoai: req.body.soDienThoai ?? ""
        });

        await nhanVienCongTy.save(); // Lưu nhân viên mới vào cơ sở dữ liệu
        res.send(nhanVienCongTy); // Trả về nhân viên vừa tạo
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Endpoint PUT để cập nhật thông tin nhân viên công ty theo ID
router.put('/nhanviencongty/:id', async (req, res) => {
    try {
        // Lấy nhân viên công ty hiện tại
        const nhanVienCongTy = await NhanVienCongTy.findById(req.params.id);
        if (!nhanVienCongTy) {
            return res.status(404).send({ error: 'Nhân viên không tìm thấy!' });
        }

        // Nếu congTyId được cung cấp trong req.body, kiểm tra xem công ty có tồn tại không
        if (req.body.congTyId) {
            const congTyExists = await CongTy.exists({ _id: req.body.congTyId });
            if (!congTyExists) {
                return res.status(404).send({ error: 'Công ty không tồn tại!' });
            }
        }

        // Cập nhật các trường chỉ nếu chúng được cung cấp trong req.body
        nhanVienCongTy.congTyId = req.body.congTyId ?? nhanVienCongTy.congTyId;
        nhanVienCongTy.maNhanVien = req.body.maNhanVien ?? nhanVienCongTy.maNhanVien;
        nhanVienCongTy.soCMT = req.body.soCMT ?? nhanVienCongTy.soCMT;
        nhanVienCongTy.ten = req.body.ten ?? nhanVienCongTy.ten;
        nhanVienCongTy.ngaySinh = req.body.ngaySinh ?? nhanVienCongTy.ngaySinh;
        nhanVienCongTy.soDienThoai = req.body.soDienThoai ?? nhanVienCongTy.soDienThoai;

        await nhanVienCongTy.save(); // Lưu nhân viên công ty đã cập nhật vào cơ sở dữ liệu
        res.send(nhanVienCongTy); // Trả về nhân viên đã cập nhật
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


// Endpoint DELETE để xóa một nhân viên theo ID
router.delete('/nhanviencongty/:id', async (req, res) => {
    try {
        const nhanVien = await NhanVienCongTy.findByIdAndDelete(req.params.id);
        if (!nhanVien) return res.status(404).send({ error: 'Nhân viên không tìm thấy!' });
        res.send({ message: 'Nhân viên đã được xóa thành công!' }); // Trả về thông báo thành công
    } catch (error) {
        res.status(500).send({ error: error.message }); // Trả về lỗi nếu có
    }
});

/*
Các chức năng khác : viết làm phong phú thêm


*/
// Lấy danh sách nhân viên của một công ty
router.get('/nhanviencongty/congty/:congTyId', async (req, res) => {
    try {
        const nhanViens = await NhanVienCongTy.find({ congTyId: req.params.congTyId }).populate('congTyId');
        res.send(nhanViens);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});



module.exports = router;
