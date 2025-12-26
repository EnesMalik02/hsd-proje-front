import Navbar from "@/components/Navbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-50 text-gray-900 flex-col overflow-y-auto">
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto p-6">
                {children}
            </main>
        </div>
    );
}
