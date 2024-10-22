const express = require("express");
const NhatKyRaVao = require("../models/NhatKyRaVao"); // Import model NhatKyRaVao
const NhanVienCongTy = require('../models/NhanVienCongTy'); // Import model NhanVienCongTy

const router = express.Router();
const mongoose = require('mongoose');


// Endpoint GET để trả về tất cả các nhật ký ra vào
router.get('/nhatkyravao', async (req, res) => {
    try {
        // const nhatKys = await NhatKyRaVao.find({}).populate('nhanVienId'); // Lấy tất cả nhật ký và populate thông tin nhân viên
        const nhatKys = await NhatKyRaVao.find({}); // Lấy tất cả nhật ký và populate thông tin nhân viên

        res.send(nhatKys); // Trả về danh sách nhật ký ra vào
    } catch (error) {
        res.status(500).send({ error: error.message }); // Trả về lỗi nếu có
    }
});

// Endpoint GET để trả về một nhật ký ra vào theo ID
router.get('/nhatkyravao/:id', async (req, res) => {
    try {
        const nhatKy = await NhatKyRaVao.findById(req.params.id).populate('nhanVienId'); // Tìm nhật ký ra vào theo ID và populate thông tin nhân viên
        if (!nhatKy) return res.status(404).send({ error: 'Nhật ký không tìm thấy!' });
        res.send(nhatKy); // Trả về nhật ký ra vào
    } catch (error) {
        res.status(500).send({ error: error.message }); // Trả về lỗi nếu có
    }
});

// Endpoint GET để trả về tất cả các nhật ký ra vào theo nhân viên
router.get('/nhatkyravao/nhanvien/:id', async (req, res) => {
    try {
        // Kiểm tra xem nhân viên có tồn tại không
        const nhanVien = await NhanVienCongTy.findById(req.params.id);
        if (!nhanVien) {
            return res.status(404).send({ error: 'Nhân viên không tồn tại!' });
        }

        // Tìm tất cả nhật ký ra vào của nhân viên theo ID nhân viên
        const nhatKyRaVaoList = await NhatKyRaVao.find({ nhanVienId : req.params.id });

        // Trả về danh sách nhật ký ra vào của nhân viên
        res.send(nhatKyRaVaoList);
    } catch (error) {
        // Trả về lỗi nếu có
        res.status(500).send({ error: error.message });
    }
});



// Endpoint POST để tạo một nhật ký ra vào mới
router.post('/nhatkyravao', async (req, res) => {
    try {
        // Tạo một nhật ký ra vào mới với các giá trị từ request body hoặc giá trị mặc định
        const nhatKyRaVao = new NhatKyRaVao({
            nhanVienId: req.body.nhanVienId, // Yêu cầu cung cấp mã nhân viên
            thoiGian: req.body.thoiGian ?? Date.now(), // Nếu không có thời gian, sử dụng thời gian hiện tại
            viTri: req.body.viTri ?? "" // Giá trị mặc định là chuỗi rỗng nếu không có
        });

        // Kiểm tra xem nhân viên có tồn tại hay không
        const nhanVien = await NhanVienCongTy.findById(req.body.nhanVienId);
        if (!nhanVien) {
            return res.status(400).send({ error: 'Nhân viên không tồn tại!' });
        }

        // Lưu nhật ký ra vào mới vào cơ sở dữ liệu
        await nhatKyRaVao.save();

        // Trả về nhật ký ra vào vừa tạo
        res.status(201).send(nhatKyRaVao);
    } catch (error) {
        // Trả về lỗi nếu có
        res.status(500).send({ error: error.message });
    }
});

// Endpoint PUT để cập nhật một nhật ký ra vào theo ID
router.put('/nhatkyravao/:id', async (req, res) => {
    try {
        // Tìm nhật ký ra vào theo ID và cập nhật với các giá trị từ request body hoặc giữ nguyên
        const nhatKyRaVao = await NhatKyRaVao.findByIdAndUpdate(
            req.params.id,
            {
                nhanVienId: req.body.nhanVienId ?? undefined, // Giữ nguyên nếu không có trong yêu cầu
                thoiGian: req.body.thoiGian ?? undefined, // Giữ nguyên nếu không có trong yêu cầu
                viTri: req.body.viTri ?? undefined // Giữ nguyên nếu không có trong yêu cầu
            },
            { new: true, runValidators: true }
        );

        if (!nhatKyRaVao) {
            return res.status(404).send({ error: 'Nhật ký ra vào không tìm thấy!' });
        }

        // Trả về nhật ký ra vào đã cập nhật
        res.send(nhatKyRaVao);
    } catch (error) {
        // Trả về lỗi nếu có
        res.status(500).send({ error: error.message });
    }
});


// Endpoint DELETE để xóa một nhật ký ra vào theo ID
router.delete('/nhatkyravao/:id', async (req, res) => {
    try {
        const nhatKy = await NhatKyRaVao.findByIdAndDelete(req.params.id);
        if (!nhatKy) return res.status(404).send({ error: 'Nhật ký không tìm thấy!' });
        res.send({ message: 'Nhật ký ra vào đã được xóa thành công!' }); // Trả về thông báo thành công
    } catch (error) {
        res.status(500).send({ error: error.message }); // Trả về lỗi nếu có
    }
});



/*
Các chức năng khác : viết làm phong phú thêm


*/



module.exports = router;
