const fields = [
  {
    label: 'Chức danh',
    placeholder: 'Nhập chức danh',
    options: [
      'Nhà thiết kế (Designer)',
      'Lập trình viên (Developer)',
      'Quản lý sản phẩm (Product Manager)',
      'Chuyên viên Marketing',
      'Chuyên viên phân tích dữ liệu',
      'Nhân viên kinh doanh',
      'Nhân viên nội dung',
      'Chăm sóc khách hàng',
    ],
  },
  {
    label: 'Công ty',
    placeholder: 'Nhập tên công ty',
    options: ['Google', 'Microsoft', 'Meta', 'Netflix', 'Adobe', 'Facebook', 'Amazon', 'Apple', 'Spotify'],
  },
  {
    label: 'Kinh nghiệm',
    placeholder: 'Nhập kinh nghiệm',
    options: ['Mới tốt nghiệp / Junior', 'Trung cấp', 'Chuyên gia'],
  },
  {
    label: 'Hình thức',
    placeholder: 'Nhập hình thức làm việc',
    options: ['Toàn thời gian', 'Bán thời gian', 'Hợp đồng', 'Freelance', 'Thực tập'],
  },
  {
    label: 'Địa điểm',
    placeholder: 'Nhập địa điểm làm việc',
    options: ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Nha Trang', 'Huế', 'Bình Dương'],
  },
  {
    label: 'Mức lương',
    placeholder: 'Nhập mức lương',
    options: ['Từ 5.000.000đ', 'Từ 10.000.000đ', 'Từ 15.000.000đ', 'Từ 20.000.000đ', 'Trên 30.000.000đ'],
  },
];

const content =
  '<h4>Giới thiệu về công việc</h4><p>Nhập mô tả tổng quan về vị trí tuyển dụng...</p><h4>Trách nhiệm chính</h4><ul><li>Thêm các trách nhiệm chính của vị trí...</li></ul><h4>Yêu cầu và kỹ năng</h4><ul><li>Thêm các yêu cầu về kinh nghiệm, kỹ năng, bằng cấp...</li></ul>';

export { fields, content };