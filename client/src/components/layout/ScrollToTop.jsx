import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * Tự động cuộn trang lên vị trí đầu (top: 0) mỗi khi người dùng chuyển trang trong React Router.
 * Nếu có neo liên kết (#hash), sẽ cuộn mượt mà đến đúng phần tử đó.
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // Cuộn lên đầu trang ngay lập tức khi chuyển route
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname, search, hash]);

  return null;
}
