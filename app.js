const express = require("express");
const PostRouter = require("./routes/PostRouter"); // Đường dẫn tới file PostRouter.js
const CongTyRouter = require("./routes/CongTyRouter"); // Đường dẫn tới file PostRouter.js
const NhanVienCongTyRouter = require("./routes/NhanVienCongTyRouter");
const DichVuRouter = require("./routes/DichVuRouter");
const CongTyDichVuRouter = require("./routes/CongTyDichVuRouter");
const NhanVienToaNhaRouter = require("./routes/NhanVienToaNhaRouter");
const NhanVienDichVuRouter = require("./routes/NhanVienDichVuRouter");
const NhatKyRaVaoRouter = require("./routes/NhatKyRaVaoRouter"); // Router thứ 7


const dbConnect = require("./db/dbConnect"); // Đảm bảo đã kết nối với MongoDB

const app = express();

dbConnect(); // Kết nối đến MongoDB

app.use(express.json()); // Middleware để parse JSON trong request body
app.use("/api", PostRouter); // Sử dụng PostRouter cho các yêu cầu tới /api
app.use("/api", CongTyRouter); // Sử dụng PostRouter cho các yêu cầu tới /api
app.use("/api/", NhanVienCongTyRouter); // Router cho nhân viên công ty
app.use("/api/", DichVuRouter); // Router cho các dịch vụ
app.use("/api/", CongTyDichVuRouter); // Router cho công ty sử dụng dịch vụ
app.use("/api/", NhanVienToaNhaRouter); // Router cho nhân viên tòa nhà
app.use("/api/", NhanVienDichVuRouter); // Router cho nhật ký ra vào (Router thứ 7)
app.use("/api/", NhatKyRaVaoRouter); // Router cho nhật ký ra vào (Router thứ 7)


app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
