import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-gray-100">
            <Sidebar />
            <div className="p-4 sm:ml-64">
                {children}
            </div>
        </div>
    );
}
