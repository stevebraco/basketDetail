import Header from "@/layout/Header";
import NavSidebar from "@/layout/NavSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isExpanded = true;
  const isHovered = false;
  const mainContentMargin = false
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";
  return (
    <div className="min-h-screen xl:flex">
      <NavSidebar />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        <Header />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
