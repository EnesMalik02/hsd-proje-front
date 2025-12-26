"use client";

export default function Home() {
    return (
        <div>
            <div className="p-4 mt-8">
                {/* Header Content */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Anasayfa
                        </h1>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                            Hoş geldiniz, platformdaki ilanları buradan takip edebilirsiniz.
                        </p>
                    </div>
                </div>

                {/* Dashboard Content Placeholders */}
                <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="flex h-32 items-center justify-center rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <p className="text-2xl text-gray-400 dark:text-gray-500">
                            Aktif İlanlar
                        </p>
                    </div>
                    <div className="flex h-32 items-center justify-center rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <p className="text-2xl text-gray-400 dark:text-gray-500">
                            Mesajlar
                        </p>
                    </div>
                    <div className="flex h-32 items-center justify-center rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <p className="text-2xl text-gray-400 dark:text-gray-500">
                            Bildirimler
                        </p>
                    </div>
                </div>

                <div className="flex h-96 items-center justify-center rounded bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700">
                    <p className="text-lg text-gray-500">
                        İlan akışı burada listelenecek...
                    </p>
                </div>
            </div>
        </div>
    );
}
