import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import MobileHeader from './MobileHeader';

export default function Layout() {
  return (
    <div className="page-layout">
      <MobileHeader />
      <BottomNav />
      <main>
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
