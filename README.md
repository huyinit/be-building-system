# PROJECT 4: 
## Kịch bản thế giới thực: Xây dựng hệ thống quản lý một Toà nhà văn phòng.

### Các yêu cầu về CSDL bao gồm:
- **Công ty thuê văn phòng trong toà nhà**: Thông tin cơ bản bao gồm tên công ty, mã số thuế, vốn điều lệ, lĩnh vực hoạt động, số nhân viên, địa chỉ trong toà nhà, số điện thoại, diện tích mặt bằng.
- **Nhân viên công ty**: Thông tin bao gồm mã nhân viên, CMT, tên, ngày sinh, số điện thoại.
- **Dịch vụ trong toà nhà**: Thông tin về mã số dịch vụ, tên dịch vụ, loại dịch vụ, đơn giá.
- **Nhân viên của toà nhà**: Thông tin bao gồm mã nhân viên, tên, ngày sinh, địa chỉ, số điện thoại, bậc, vị trí.

### Sử dụng dịch vụ:
- Các công ty thuê văn phòng sử dụng các dịch vụ như vệ sinh, ăn uống, trông giữ xe, bảo vệ, bảo trì thiết bị.
- Đơn giá dịch vụ tỉ lệ thuận với số người trong công ty và diện tích sàn thuê. Cụ thể:
  - Công ty dưới 10 người và thuê dưới 100 m²: mức giá cố định.
  - Mỗi 5 người thêm hoặc mỗi 10 m² thêm: đơn giá tăng 5% cho mỗi mục.
- Mỗi công ty bắt buộc sử dụng dịch vụ bảo vệ và vệ sinh, các dịch vụ khác là tùy chọn.
- Tiền dịch vụ được tính từ ngày đăng ký hoặc từ đầu tháng đến thời điểm hiện tại, tỉ lệ theo số ngày đã sử dụng trong tháng.

### Quản lý ra vào:
- Nhân viên công ty được cấp thẻ ra/vào, và thông tin về số lần ra/vào cần được lưu trữ.
- Thông tin về mỗi lần ra/vào bao gồm vị trí (tầng 1, hầm B1, hầm B2), thời gian.

### Quản lý nhân viên của toà nhà:
- Các nhân viên của toà nhà cung cấp và giám sát dịch vụ, lương tính theo vị trí và loại dịch vụ thực hiện.
- Lương tỉ lệ thuận với doanh thu của từng loại dịch vụ. Học viên cần xây dựng công thức tính lương phù hợp.

### Các yêu cầu truy vấn:
1. **Liệt kê thông tin công ty** cùng với tổng số tiền mỗi tháng (tính đến thời điểm hiện tại) bao gồm tiền thuê mặt bằng và tổng tiền dịch vụ. Danh sách công ty sắp xếp theo thứ tự giảm dần về chi phí.
2. **Kiểm tra thông tin nhân viên công ty**: Thông tin nhân viên cùng với số lần và vị trí ra/vào toà nhà trong ngày.
3. **Liệt kê thông tin nhân viên toà nhà** cùng với lương tháng. Nhân viên có thể đổi vị trí và dịch vụ mỗi tháng.

### Ràng buộc:
- Ứng dụng cần đảm bảo số lượng bản ghi tuân theo các ràng buộc yêu cầu.
