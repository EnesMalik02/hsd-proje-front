

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen w-full flex flex-col bg-[#f8f9fa] text-gray-900 font-sans">


            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-4">
                {children}
            </main>

            {/* Footer */}
            <footer className="py-8 text-center text-xs text-gray-400">
                © 2024 Loopa. All rights reserved.
            </footer>
        </div>
    );
}
