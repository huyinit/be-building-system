const express = require("express");
const CongTyDichVu = require("../models/CongTyDichVu"); // Import model CongTyDichVu
const DichVu = require("../models/DichVu"); // Import model DichVu
const CongTy = require("../models/CongTy"); // Import model CongTy

const router = express.Router();

// Endpoint GET để trả về tất cả các công ty và dịch vụ đã sử dụng
router.get('/congtydichvu', async (req, res) => {
    try {
        const congTyDichVus = await CongTyDichVu.find({}); // Lấy tất cả từ MongoDB, đồng thời populate dữ liệu công ty và dịch vụ
        // const congTyDichVus = await CongTyDichVu.find({}).populate('congTyId').populate('dichVuSuDungId'); // Lấy tất cả từ MongoDB, đồng thời populate dữ liệu công ty và dịch vụ
        res.send(congTyDichVus); // Trả về danh sách các công ty và dịch vụ đã sử dụng
    } catch (error) {
        res.status(500).send({ error: error.message }); // Trả về lỗi nếu có
    }
});

// Endpoint GET để trả về một công ty dịch vụ theo ID
router.get('/congtydichvu/:id', async (req, res) => {
    try {
        const congTyDichVu = await CongTyDichVu.findById(req.params.id).populate('congTyId').populate('dichVuSuDungId'); // Tìm công ty dịch vụ theo ID và populate công ty, dịch vụ
        if (!congTyDichVu) return res.status(404).send({ error: 'Công ty dịch vụ không tìm thấy!' });
        res.send(congTyDichVu); // Trả về công ty dịch vụ
    } catch (error) {
        res.status(500).send({ error: error.message }); // Trả về lỗi nếu có
    }
});



// Endpoint POST để tạo một CongTyDichVu mới
router.post('/congtydichvu', async (req, res) => {
    try {
        // Lấy danh sách các dịch vụ từ mảng dichVuSuDungId
        const dichVus = await DichVu.find({ _id: { $in: req.body.dichVuSuDungId } });

        // Tính tổng chi phí thuê dịch vụ dựa trên các dịch vụ
        let tongChiPhi = 0;
        dichVus.forEach(dichVu => {
            tongChiPhi += dichVu.giaThueDichVu;
        });

        // Lấy thông tin từ CongTy nếu không có soNhanVien và dienTich trong req.body
        let soNhanVien = req.body.soNhanVien;
        let dienTich = req.body.dienTich;

        if (soNhanVien == null || dienTich == null) {
            const congTy = await CongTy.findById(req.body.congTyId); // Tìm công ty theo ID

            if (!congTy) {
                return res.status(404).send({ error: 'Công ty không tồn tại!' });
            }

            // Nếu không có trong req.body, lấy giá trị mặc định từ đối tượng CongTy
            soNhanVien = soNhanVien ?? congTy.soNhanVien ?? 0;
            dienTich = dienTich ?? congTy.dienTich ?? 0;
        }

        // Tính thêm chi phí dựa trên số nhân viên và diện tích
        const chiPhiNhanVien = soNhanVien * 100000; // Ví dụ: 100,000 VND mỗi nhân viên
        const chiPhiDienTich = dienTich * 50000; // Ví dụ: 50,000 VND cho mỗi m²

        tongChiPhi += chiPhiNhanVien + chiPhiDienTich;

        // Tạo đối tượng CongTyDichVu mới
        const congTyDichVu = new CongTyDichVu({
            congTyId: req.body.congTyId,
            nam: req.body.nam ?? new Date().getFullYear(),
            thang: req.body.thang ?? new Date().getMonth() + 1,
            soNhanVien: soNhanVien, // Số nhân viên lấy từ req.body hoặc từ CongTy
            dienTich: dienTich, // Diện tích lấy từ req.body hoặc từ CongTy
            tongChiPhi: tongChiPhi, // Tổng chi phí đã được tính toán
            dichVuSuDungId: req.body.dichVuSuDungId // Giữ danh sách các dịch vụ đã sử dụng
        });

        // Lưu tài liệu vào cơ sở dữ liệu
        await congTyDichVu.save();
        res.send(congTyDichVu); // Trả về tài liệu vừa tạo
    } catch (error) {
        if (error.code === 11000) { // Mã lỗi cho vi phạm ràng buộc duy nhất
            res.status(400).send({ error: 'Dữ liệu đã tồn tại' });
        } else {
            res.status(500).send({ error: error.message }); // Trả về lỗi khác nếu có
        }
    }
});


// Endpoint PUT để cập nhật một công ty dịch vụ theo ID
// Endpoint PUT để cập nhật một công ty dịch vụ theo ID
router.put('/congtydichvu/:id', async (req, res) => {
    try {
        // Lấy CongTyDichVu hiện tại từ cơ sở dữ liệu
        let congTyDichVu = await CongTyDichVu.findById(req.params.id);
        if (!congTyDichVu) {
            return res.status(404).send({ error: 'Công ty dịch vụ không tìm thấy!' });
        }

        // Lấy danh sách các dịch vụ từ mảng dichVuSuDungId trong req.body
        const dichVus = await DichVu.find({ _id: { $in: req.body.dichVuSuDungId || congTyDichVu.dichVuSuDungId } });

        // Tính tổng chi phí thuê dịch vụ dựa trên các dịch vụ
        let tongChiPhi = 0;
        dichVus.forEach(dichVu => {
            tongChiPhi += dichVu.giaThueDichVu;
        });

        // Lấy thông tin từ CongTy nếu không có soNhanVien và dienTich trong req.body
        let soNhanVien = req.body.soNhanVien;
        let dienTich = req.body.dienTich;

        if (soNhanVien == null || dienTich == null) {
            const congTy = await CongTy.findById(req.body.congTyId || congTyDichVu.congTyId); // Tìm công ty theo ID

            if (!congTy) {
                return res.status(404).send({ error: 'Công ty không tồn tại!' });
            }

            // Nếu không có trong req.body, lấy giá trị mặc định từ đối tượng CongTy
            soNhanVien = soNhanVien ?? congTy.soNhanVien ?? 0;
            dienTich = dienTich ?? congTy.dienTich ?? 0;
        }

        // Tính thêm chi phí dựa trên số nhân viên và diện tích
        const chiPhiNhanVien = soNhanVien * 100000; // Ví dụ: 100,000 VND mỗi nhân viên
        const chiPhiDienTich = dienTich * 50000; // Ví dụ: 50,000 VND cho mỗi m²

        tongChiPhi += chiPhiNhanVien + chiPhiDienTich;

        // Cập nhật các trường của CongTyDichVu
        congTyDichVu.congTyId = req.body.congTyId || congTyDichVu.congTyId;
        congTyDichVu.nam = req.body.nam || congTyDichVu.nam;
        congTyDichVu.thang = req.body.thang || congTyDichVu.thang;
        congTyDichVu.soNhanVien = soNhanVien;
        congTyDichVu.dienTich = dienTich;
        congTyDichVu.tongChiPhi = tongChiPhi; // Cập nhật tổng chi phí mới
        congTyDichVu.dichVuSuDungId = req.body.dichVuSuDungId || congTyDichVu.dichVuSuDungId;

        // Lưu đối tượng CongTyDichVu đã cập nhật vào cơ sở dữ liệu
        await congTyDichVu.save();

        // Trả về CongTyDichVu đã cập nhật
        res.send(congTyDichVu);
    } catch (error) {
        res.status(500).send({ error: error.message }); // Trả về lỗi nếu có
    }
});


// Endpoint DELETE để xóa một công ty dịch vụ theo ID
router.delete('/congtydichvu/:id', async (req, res) => {
    try {
        const congTyDichVu = await CongTyDichVu.findByIdAndDelete(req.params.id);
        if (!congTyDichVu) return res.status(404).send({ error: 'Công ty dịch vụ không tìm thấy!' });
        res.send({ message: 'Công ty dịch vụ đã được xóa thành công!' }); // Trả về thông báo thành công
    } catch (error) {
        res.status(500).send({ error: error.message }); // Trả về lỗi nếu có
    }
});


/*
Các chức năng khác : viết làm phong phú thêm


*/




module.exports = router;
