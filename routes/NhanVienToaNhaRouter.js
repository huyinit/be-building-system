const express = require("express");
const NhanVienToaNha = require("../models/NhanVienToaNha"); // Import model NhanVienToaNha
const router = express.Router();

// Endpoint GET để trả về tất cả các nhân viên tòa nhà
router.get('/nhanvientoanha', async (req, res) => {
    try {
        const nhanViens = await NhanVienToaNha.find({}); // Lấy tất cả nhân viên từ MongoDB
        res.send(nhanViens); // Trả về danh sách nhân viên
    } catch (error) {
        res.status(500).send({ error: error.message }); // Trả về lỗi nếu có
    }
});

// Endpoint GET để trả về một nhân viên theo ID
router.get('/nhanvientoanha/:id', async (req, res) => {
    try {
        const nhanVien = await NhanVienToaNha.findById(req.params.id); // Tìm nhân viên theo ID
        if (!nhanVien) return res.status(404).send({ error: 'Nhân viên không tìm thấy!' });
        res.send(nhanVien); // Trả về nhân viên
    } catch (error) {
        res.status(500).send({ error: error.message }); // Trả về lỗi nếu có
    }
});

// Endpoint POST để tạo một nhân viên mới
router.post('/nhanvientoanha', async (req, res) => {
    const nhanVien = new NhanVienToaNha({
        maNhanVien: req.body.maNhanVien ?? "",
        ten: req.body.ten ?? "",
        ngaySinh: req.body.ngaySinh ?? new Date(),
        diaChi: req.body.diaChi ?? "",
        soDienThoai: req.body.soDienThoai ?? "",
        bac: req.body.bac ?? "",
        viTri: req.body.viTri ?? ""
    });

    try {
        const newNhanVien = await nhanVien.save(); // Lưu nhân viên mới vào MongoDB
        res.status(201).json(newNhanVien); // Trả về nhân viên mới tạo
    } catch (error) {
        res.status(400).json({ message: error.message }); // Trả về lỗi nếu có
    }
});

// Endpoint PUT để cập nhật một nhân viên theo ID
router.put('/nhanvientoanha/:id', async (req, res) => {
    try {
        const nhanVien = await NhanVienToaNha.findById(req.params.id); // Tìm nhân viên theo ID
        if (!nhanVien) return res.status(404).json({ message: 'Nhân viên không tồn tại' });

        // Cập nhật các trường từ body của request
        nhanVien.maNhanVien = req.body.maNhanVien || nhanVien.maNhanVien;
        nhanVien.ten = req.body.ten || nhanVien.ten;
        nhanVien.ngaySinh = req.body.ngaySinh || nhanVien.ngaySinh;
        nhanVien.diaChi = req.body.diaChi || nhanVien.diaChi;
        nhanVien.soDienThoai = req.body.soDienThoai || nhanVien.soDienThoai;
        nhanVien.bac = req.body.bac || nhanVien.bac;
        nhanVien.viTri = req.body.viTri || nhanVien.viTri;

        const updatedNhanVien = await nhanVien.save(); // Lưu thông tin đã cập nhật
        res.json(updatedNhanVien); // Trả về nhân viên đã cập nhật
    } catch (error) {
        res.status(400).json({ message: error.message }); // Trả về lỗi nếu có
    }
});

// Endpoint DELETE để xóa một nhân viên theo ID
router.delete('/nhanvientoanha/:id', async (req, res) => {
    try {
        const nhanVien = await NhanVienToaNha.findByIdAndDelete(req.params.id);
        if (!nhanVien) return res.status(404).send({ error: 'Nhân viên không tìm thấy!' });
        res.send({ message: 'Nhân viên đã được xóa thành công!' }); // Trả về thông báo thành công
    } catch (error) {
        res.status(500).send({ error: error.message }); // Trả về lỗi nếu có
    }
});



/*
Các chức năng khác : viết làm phong phú thêm


*/



module.exports = router;
