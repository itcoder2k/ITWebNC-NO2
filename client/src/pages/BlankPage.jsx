import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function BlankPage({ title = "Tính năng đang được phát triển" }) {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');
  const cat = searchParams.get('cat');
  const tab = searchParams.get('tab');
  const action = searchParams.get('action');

  let detailMessage = "Module giao diện này thuộc lộ trình phát triển của các thành viên khác trong nhóm.";
  if (search) detailMessage = `Kết quả tìm kiếm cho từ khóa: "${search}"`;
  else if (cat) detailMessage = `Danh mục "${cat.toUpperCase()}" đang được kết nối với API backend.`;
  else if (tab) detailMessage = `Phân hệ quản trị "${tab}" sẽ sớm hoàn thiện.`;
  else if (action) detailMessage = `Hành động "${action}" đang được cấu hình.`;

  return (
    <div className="container py-5 text-center my-auto" style={{ minHeight: '60vh' }}>
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card bg-white border border-light-subtle p-4 p-md-5 rounded-4 shadow-sm">
            <div className="display-4 mb-3 text-primary">
              <i className="bi bi-cone-striped"></i>
            </div>
            <h3 className="fw-bold text-dark mb-2">{title}</h3>
            <p className="text-muted mb-4">{detailMessage}</p>
            <div className="d-flex justify-content-center gap-2">
              <Link to="/" className="btn btn-app-primary px-4 py-2">
                <i className="bi bi-arrow-left me-1"></i> Quay về Trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
