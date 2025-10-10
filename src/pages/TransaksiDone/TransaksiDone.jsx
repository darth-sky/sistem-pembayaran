import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';

const TransaksiDone = () => {
    const location = useLocation();
    const transactionData = location.state?.transactionData;

    if (!transactionData) {
        return <Navigate to="/" />;
    }

    // Sesuaikan dengan response BARU dari server
    const {
        id_transaksi: nomor_antrian,
        nama_pemesan: nama_guest,
        total_harga: total_harga_final,
        detail_order // <-- SEKARANG KITA MENERIMA INI
    } = transactionData;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-center">
                <svg className="w-20 h-20 mx-auto mb-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Pesanan Berhasil Dibuat!
                </h1>
                <p className="text-gray-500 mb-6">
                    Silakan selesaikan pembayaran di kasir dengan menunjukkan detail pesanan di bawah ini.
                </p>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-600">Nama:</span>
                        <span className="font-semibold text-gray-800">{nama_guest}</span>
                    </div>

                    <hr className="my-2" />

                    {/* AKTIFKAN KEMBALI BAGIAN RINCIAN PESANAN */}
                    <h3 className="font-semibold text-gray-600 pt-2">Rincian Pesanan:</h3>
                    <div className='space-y-1'>
                        {detail_order && detail_order.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                                {/* Bungkus nama produk dan catatan dalam satu div */}
                                <div>
                                    <span className="text-gray-700">{item.nama_produk} (x{item.jumlah})</span>

                                    {/* TAMBAHKAN BLOK INI */}
                                    {/* Tampilkan paragraf ini hanya jika item.catatan_pesanan ada */}
                                    {item.catatan_pesanan && (
                                        <p className="text-xs text-gray-500 italic pl-2">
                                            Catatan: {item.catatan_pesanan}
                                        </p>
                                    )}
                                    {/* AKHIR BLOK TAMBAHAN */}

                                </div>
                                <span className="text-gray-700">
                                    Rp {parseInt(item.harga_saat_order * item.jumlah).toLocaleString('id-ID')}
                                </span>
                            </div>
                        ))}
                    </div>

                    <hr className="my-2" />

                    <div className="flex justify-between items-center pt-2">
                        <span className="font-bold text-gray-800 text-lg">Total Bayar:</span>
                        <span className="font-bold text-green-600 text-lg">
                            Rp {(total_harga_final || 0).toLocaleString('id-ID')}
                        </span>
                    </div>
                </div>

                <div className="flex justify-center">
                    <Link to='/' className="bg-testPrimary text-white rounded-lg px-6 py-3 shadow-md hover:bg-opacity-90 transition w-full">
                        Kembali Ke Menu
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default TransaksiDone;