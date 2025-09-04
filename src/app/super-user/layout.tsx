import Navbar from "./Navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-dvh flex flex-col gap-6">
      <Navbar />
      <main className="x-padding flex-1">{children}</main>
    </div>
  );
};

export default DashboardLayout;
