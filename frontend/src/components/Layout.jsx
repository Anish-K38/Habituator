import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <div className="page-layout">
      <BottomNav />
      <main style={{ flex: 1, minWidth: 0 }}>
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
