import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import BottomBar from '../components/BottomBar';
import ContextPreview from '../components/ContextPreview';
import LiveOutput from '../components/LiveOutput';

export default function Workspace() {
  return (
    <div className="h-screen flex flex-col bg-bg-primary">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 grid grid-cols-2 gap-4 p-6 overflow-auto">
          <ContextPreview />
          <LiveOutput />
        </div>
      </div>
      <BottomBar />
    </div>
  );
}

// Made with Bob
