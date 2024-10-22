const express = require("express");
const NhanVienDichVu = require("../models/NhanVienDichVu"); // Import model NhanVienDichVu
const NhanVienToaNha = require("../models/NhanVienToaNha"); // Import model NhanVienToaNha
const DichVu = require("../models/DichVu"); // Import model DichVu

const router = express.Router();

// Endpoint GET để trả về tất cả các nhân viên và dịch vụ đã sử dụng
router.get('/nhanviendichvu', async (req, res) => {
    try {
        const nhanVienDichVus = await NhanVienDichVu.find({}).populate('nhanVienId').populate('danhSachDichVu');
        res.send(nhanVienDichVus); // Trả về danh sách các dịch vụ mà nhân viên đã sử dụng
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Endpoint GET - Lấy một nhân viên và dịch vụ đã sử dụng theo ID
router.get('/nhanviendichvu/:id', async (req, res) => {
    try {
        const nhanVienDichVu = await NhanVienDichVu.findById(req.params.id).populate('nhanVienId').populate('danhSachDichVu');
        if (!nhanVienDichVu) return res.status(404).send({ error: 'Không tìm thấy bản ghi nhân viên dịch vụ!' });
        res.send(nhanVienDichVu);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


// 3. Endpoint POST - Tạo bản ghi dịch vụ cho nhân viên
router.post('/nhanviendichvu', async (req, res) => {
    try {
        // Lấy danh sách các dịch vụ mà nhân viên đã làm từ mảng dichVuSuDungId
        const dichVus = await DichVu.find({ _id: { $in: req.body.danhSachDichVu } });

        if (dichVus.length === 0) {
            return res.status(400).send({ error: 'Danh sách dịch vụ trống hoặc không hợp lệ' });
        }

        // Tính tổng tiền lương nhân viên làm được từ danh sách dịch vụ
        let tongLuong = 0;
        dichVus.forEach(dichVu => {
            tongLuong += dichVu.giaLamDichVu; // Cộng dồn tiền lương từ mỗi dịch vụ
        });

        // Kiểm tra xem nhân viên có tồn tại hay không
        const nhanVien = await NhanVienToaNha.findById(req.body.nhanVienId);
        if (!nhanVien) {
            return res.status(404).send({ error: 'Nhân viên không tồn tại!' });
        }

        // Tạo đối tượng NhanVienDichVu mới
        const nhanVienDichVu = new NhanVienDichVu({
            nhanVienId: req.body.nhanVienId,
            nam: req.body.nam ?? new Date().getFullYear(),
            thang: req.body.thang ?? new Date().getMonth() + 1,
            luong: tongLuong, // Tổng lương được tính dựa trên các dịch vụ đã thực hiện
            danhSachDichVu: req.body.danhSachDichVu // Danh sách dịch vụ mà nhân viên đã làm
        });

        // Lưu bản ghi mới vào cơ sở dữ liệu
        await nhanVienDichVu.save();
        res.send(nhanVienDichVu);
    } catch (error) {
        if (error.code === 11000) { // Kiểm tra lỗi vi phạm unique (năm + tháng + nhân viên)
            res.status(400).send({ error: 'Bản ghi nhân viên dịch vụ đã tồn tại cho tháng và năm này.' });
        } else {
            res.status(500).send({ error: error.message });
        }
    }
});


// Endpoint PUT - Cập nhật một bản ghi nhân viên dịch vụ theo ID
router.put('/nhanviendichvu/:id', async (req, res) => {
    try {
        // Tìm bản ghi NhanVienDichVu theo ID
        let nhanVienDichVu = await NhanVienDichVu.findById(req.params.id);
        if (!nhanVienDichVu) {
            return res.status(404).send({ error: 'Không tìm thấy bản ghi nhân viên dịch vụ!' });
        }

        // Lấy danh sách dịch vụ từ yêu cầu hoặc giữ danh sách cũ
        const dichVus = await DichVu.find({ _id: { $in: req.body.danhSachDichVu || nhanVienDichVu.danhSachDichVu } });

        if (dichVus.length === 0) {
            return res.status(400).send({ error: 'Danh sách dịch vụ trống hoặc không hợp lệ' });
        }

        // Tính lại tổng tiền lương từ các dịch vụ
        let tongLuong = 0;
        dichVus.forEach(dichVu => {
            tongLuong += dichVu.giaLamDichVu; // Cộng dồn tiền lương từ mỗi dịch vụ
        });

        // Kiểm tra xem nhân viên có tồn tại hay không
        const nhanVien = await NhanVienToaNha.findById(req.body.nhanVienId || nhanVienDichVu.nhanVienId);
        if (!nhanVien) {
            return res.status(404).send({ error: 'Nhân viên tòa nhà không tồn tại!' });
        }

        // Cập nhật các trường của NhanVienDichVu
        nhanVienDichVu.nhanVienId = req.body.nhanVienId || nhanVienDichVu.nhanVienId;
        nhanVienDichVu.nam = req.body.nam || nhanVienDichVu.nam;
        nhanVienDichVu.thang = req.body.thang || nhanVienDichVu.thang;
        nhanVienDichVu.luong = tongLuong; // Cập nhật lại lương mới
        nhanVienDichVu.danhSachDichVu = req.body.danhSachDichVu || nhanVienDichVu.danhSachDichVu;

        // Lưu bản ghi đã cập nhật vào cơ sở dữ liệu
        await nhanVienDichVu.save();
        res.send(nhanVienDichVu);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


// Endpoint DELETE - Xóa một bản ghi nhân viên dịch vụ theo ID
router.delete('/nhanviendichvu/:id', async (req, res) => {
    try {
        const nhanVienDichVu = await NhanVienDichVu.findByIdAndDelete(req.params.id);
        if (!nhanVienDichVu) return res.status(404).send({ error: 'Không tìm thấy bản ghi nhân viên dịch vụ!' });
        res.send({ message: 'Bản ghi đã được xóa thành công!' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

/*
Các chức năng khác : viết làm phong phú thêm


*/




module.exports = router;
