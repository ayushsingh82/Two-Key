import { AppSidebar } from "@/components/app-sidebar";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <AppSidebar />
      <main className="min-w-0 flex-1 p-4 md:p-10">{children}</main>
    </div>
  );
}
