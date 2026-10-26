import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const topicDetails = {
  showcase: {
    title: 'Showcase Sản Phẩm Game',
    desc: 'Nơi trưng bày các tựa game nổi bật đã hoàn thành từ cộng đồng lập trình viên sử dụng tài nguyên của GameAsset Marketplace.',
    icon: 'bi-trophy-fill',
    badge: 'Cộng đồng Game Dev'
  },
  contribute: {
    title: 'Đóng Góp Tài Nguyên Cho Cộng Đồng',
    desc: 'Chương trình chia sẻ tài nguyên mã nguồn mở, hỗ trợ các sinh viên và Indie Game Dev phát hành asset miễn phí (CC0, CC-BY).',
    icon: 'bi-heart-fill',
    badge: 'Chương trình Tình nguyện'
  },
  forum: {
    title: 'Diễn Đàn Thảo Luận Game Dev',
    desc: 'Không gian hỏi đáp kỹ thuật, chia sẻ kinh nghiệm tối ưu hóa đồ họa trên Unity, Unreal Engine, Godot và tìm kiếm đồng đội làm game.',
    icon: 'bi-chat-dots-fill',
    badge: 'Diễn đàn Trực tuyến'
  },
  conduct: {
    title: 'Quy Tắc Ứng Xử & Văn Hóa Cộng Đồng',
    desc: 'Cam kết xây dựng một môi trường phát triển game văn minh, tôn trọng bản quyền tác giả và kiên quyết bài trừ tài nguyên vi phạm pháp luật.',
    icon: 'bi-shield-shaded',
    badge: 'Quy chuẩn Đạo đức'
  },
  terms: {
    title: 'Điều Khoản Dịch Vụ',
    desc: 'Quy định chi tiết về quyền sở hữu trí tuệ, cơ chế thanh toán ví nội bộ và mô hình Trả-Tùy-Tâm (PWYW) 0% chiết khấu sàn.',
    icon: 'bi-file-text-fill',
    badge: 'Pháp lý & Thỏa thuận'
  },
  privacy: {
    title: 'Chính Sách Bảo Mật Thông Tin',
    desc: 'Hệ thống bảo vệ dữ liệu cá nhân theo chuẩn quốc tế: mật khẩu băm một chiều Bcrypt và xác thực truy cập qua JWT Bearer Token.',
    icon: 'bi-lock-fill',
    badge: 'An toàn Thông tin'
  }
};

export default function BlankPage() {
  const [searchParams] = useSearchParams();
  const topic = searchParams.get('topic') || '';

  const info = topicDetails[topic] || {
    title: 'Tính Năng Đang Trong Lộ Trình Phát Triển',
    desc: 'Module giao diện này đang được nhóm ITWebNC-NO2 tiếp tục hoàn thiện trong các giai đoạn tiếp theo của đồ án.',
    icon: 'bi-tools',
    badge: 'Lộ trình Đồ án'
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'var(--bg-body)' }}>
      <Navbar />

      <main className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-12 col-md-9 col-lg-7">
              <div 
                className="card rn-theme-card p-4 p-md-5 text-center shadow-sm"
                style={{ backgroundColor: 'var(--card-bg)', border: '1.5px solid var(--border-color)' }}
              >
                <div className="mb-3">
                  <span 
                    className="badge rounded-pill px-3 py-1.5 fw-semibold small"
                    style={{ backgroundColor: 'var(--card-header-bg)', color: 'var(--primary-color)', border: '1px solid var(--border-color)' }}
                  >
                    {info.badge}
                  </span>
                </div>

                <div 
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mx-auto mb-3"
                  style={{ width: '80px', height: '80px', backgroundColor: 'var(--search-bg)', color: 'var(--primary-color)', fontSize: '36px' }}
                >
                  <i className={`bi ${info.icon}`}></i>
                </div>

                <h3 className="fw-bolder mb-2" style={{ color: 'var(--text-main)', fontSize: '26px' }}>
                  {info.title}
                </h3>

                <p className="mx-auto mb-4" style={{ color: 'var(--text-muted)', maxWidth: '500px', lineHeight: '1.6', fontSize: '15px' }}>
                  {info.desc}
                </p>

                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <Link to="/" className="rn-btn-pill rn-btn-primary px-4 py-2">
                    <i className="bi bi-house-door me-1"></i> Về Trang chủ
                  </Link>
                  <Link to="/catalog" className="rn-btn-pill rn-btn-secondary px-4 py-2">
                    <i className="bi bi-grid me-1"></i> Khám phá kho Asset
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
