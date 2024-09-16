import { Navbar } from "./_components/navbar";
import { OrgSidebar } from "./_components/org-sidebar";
import { SideBar } from "./_components/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <main className="h-full w-full flex">
      <SideBar />
      <div className="flex h-full w-full">
        <OrgSidebar />
        <div className="flex flex-col h-full overflow-scroll w-full">
          <Navbar />
          {children}
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;
