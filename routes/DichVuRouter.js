const express = require("express");
const DichVu = require("../models/DichVu"); // Import model DichVu
const router = express.Router();

// Endpoint GET để trả về tất cả các dịch vụ
router.get('/dichvu', async (req, res) => {
    try {
        const dichVus = await DichVu.find({}); // Lấy tất cả các dịch vụ từ MongoDB
        res.send(dichVus); // Trả về danh sách các dịch vụ
    } catch (error) {
        res.status(500).send({ error: error.message }); // Trả về lỗi nếu có
    }
});

// Endpoint GET để trả về một dịch vụ theo ID
router.get('/dichvu/:id', async (req, res) => {
    try {
        const dichVu = await DichVu.findById(req.params.id); // Tìm dịch vụ theo ID
        if (!dichVu) return res.status(404).send({ error: 'Dịch vụ không tìm thấy!' });
        res.send(dichVu); // Trả về dịch vụ
    } catch (error) {
        res.status(500).send({ error: error.message }); // Trả về lỗi nếu có
    }
});

// Endpoint POST để tạo một dịch vụ mới
router.post('/dichvu', async (req, res) => {
    const dichVu = new DichVu({
        ten: req.body.ten ?? "",
        loai: req.body.loai ?? "",
        giaThueDichVu: req.body.giaThueDichVu ?? 0,
        giaLamDichVu: req.body.giaLamDichVu ?? 0
    });

    try {
        await dichVu.save(); // Lưu dịch vụ mới vào cơ sở dữ liệu
        res.send(dichVu); // Trả về dịch vụ vừa tạo
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


// Endpoint PUT để cập nhật một dịch vụ theo ID
router.put('/dichvu/:id', async (req, res) => {
    try {
        const updateData = {
            ten: req.body.ten ?? "",
            loai: req.body.loai ?? "",
            giaThueDichVu: req.body.giaThueDichVu ?? 0,
            giaLamDichVu: req.body.giaLamDichVu ?? 0
        };

        const dichVu = await DichVu.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!dichVu) return res.status(404).send({ error: 'Dịch vụ không tìm thấy!' });
        res.send(dichVu); // Trả về dịch vụ đã cập nhật
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


// Endpoint DELETE để xóa một dịch vụ theo ID
router.delete('/dichvu/:id', async (req, res) => {
    try {
        const dichVu = await DichVu.findByIdAndDelete(req.params.id);
        if (!dichVu) return res.status(404).send({ error: 'Dịch vụ không tìm thấy!' });
        res.send({ message: 'Dịch vụ đã được xóa thành công!' }); // Trả về thông báo thành công
    } catch (error) {
        res.status(500).send({ error: error.message }); // Trả về lỗi nếu có
    }
});


/*
Các chức năng khác : viết làm phong phú thêm


*/
// Lấy danh sách dịch vụ theo loại
router.get('/dichvu/type/:loai', async (req, res) => {
    try {
        const dichVus = await DichVu.find({ loai: req.params.loai });
        res.send(dichVus);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


// Lấy danh sách dịch vụ mà một công ty đã sử dụng
router.get('/congtydichvu/congty/:congTyId', async (req, res) => {
    try {
        const congTyDichVus = await CongTyDichVu.find({ congTyId: req.params.congTyId }).populate('dichVuSuDung.dichVuId');
        res.send(congTyDichVus);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});






module.exports = router;
