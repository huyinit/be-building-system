// utils/dichVuHelpers.js

/**
 * Tính đơn giá dịch vụ dựa trên số nhân viên và diện tích
 */
function tinhDonGiaDichVu(soNhanVien, dienTich, dichVu) {
    let donGia = dichVu.giaCoBan; // Đơn giá cơ bản

    // Tăng giá theo số nhân viên (5% mỗi 5 người vượt quá 10 người)
    if (soNhanVien > 10) {
        const soNhanVienVuot = soNhanVien - 10;
        const soLanTang = Math.floor(soNhanVienVuot / 5); // Mỗi 5 người tăng 5%
        donGia = donGia * Math.pow(1.05, soLanTang);
    }

    // Tăng giá theo diện tích (5% mỗi 10m² vượt quá 100m²)
    if (dienTich > 100) {
        const dienTichVuot = dienTich - 100;
        const soLanTangDienTich = Math.floor(dienTichVuot / 10); // Mỗi 10m² tăng 5%
        donGia = donGia * Math.pow(1.05, soLanTangDienTich);
    }

    return donGia;
}

/**
 * Tính tổng chi phí dịch vụ cho công ty
 */
async function tinhTongChiPhiDichVu(congTy) {
    try {
        const { soNhanVien, dienTich, dichVuSuDung } = congTy;
        let tongChiPhi = 0;

        // Tính chi phí cho từng dịch vụ công ty đang sử dụng
        dichVuSuDung.forEach(dichVu => {
            const donGiaDichVu = tinhDonGiaDichVu(soNhanVien, dienTich, dichVu);
            dichVu.giaCuoiCung = donGiaDichVu; // Cập nhật đơn giá cuối cùng
            tongChiPhi += donGiaDichVu;
        });

        return tongChiPhi;
    } catch (error) {
        console.error("Lỗi khi tính tổng chi phí dịch vụ:", error);
        throw error;
    }
}

/**
 * Tính chi phí theo số tháng sử dụng
 */
function tinhTienTheoThang(tongChiPhi, thangBatDau, thangKetThuc) {
    const soThangSuDung = thangKetThuc - thangBatDau + 1; // Số tháng sử dụng dịch vụ
    return tongChiPhi * soThangSuDung; // Tổng chi phí cho số tháng đăng ký
}

module.exports = {
    tinhDonGiaDichVu,
    tinhTongChiPhiDichVu,
    tinhTienTheoThang
};
