import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
// Import service baru dan service lama
import { createOrder, getFnbTaxRate } from '../../services/api'; // Pastikan path benar
import { Spin, Alert } from 'antd'; // Import Spin dan Alert untuk loading/error

// Helper format Rupiah (pindahkan ke utils jika sering dipakai)
const formatRupiah = (number) => {
    const num = parseFloat(number);
    if (isNaN(num)) return 'Rp 0';
    // Gunakan minimumFractionDigits: 0 untuk menghilangkan desimal ,00
    return `Rp ${num.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

const PaymentPelanggan = () => {
    const navigate = useNavigate();

    // State form
    const [activeButtonEatType, setActiveButtonEatType] = useState(1); // 1: Dine In, 2: Takeaway
    const [paymentMethod, setPaymentMethod] = useState("");
    const [namaGuest, setNamaGuest] = useState("");
    const [lokasiPemesanan, setLokasiPemesanan] = useState(""); // Default value agar select terkontrol

    // State keranjang
    const [selectedItem, setSelectedItem] = useState(() => {
        try {
            const store = localStorage.getItem('selectedItem');
            return store ? JSON.parse(store) : [];
        } catch (e) {
            console.error("Gagal parse 'selectedItem' dari localStorage:", e);
            return []; // Kembalikan array kosong jika error
        }
    });

    // State Pajak & Loading
    const [pajakPersen, setPajakPersen] = useState(0);
    const [isLoadingTax, setIsLoadingTax] = useState(true);
    const [errorTax, setErrorTax] = useState(null); // State untuk error saat fetch pajak

    // Fetch Pajak saat komponen dimuat
    useEffect(() => {
        let isMounted = true; // Flag untuk mencegah update state jika komponen unmount
        const fetchTax = async () => {
            setIsLoadingTax(true);
            setErrorTax(null); // Reset error
            try {
                const rate = await getFnbTaxRate();
                if (isMounted) {
                    setPajakPersen(rate);
                }
            } catch (err) {
                if (isMounted) {
                    setErrorTax("Gagal memuat tarif pajak. Menggunakan default 10%.");
                    setPajakPersen(10); // Fallback jika API gagal
                    console.error(err);
                }
            } finally {
                if (isMounted) {
                    setIsLoadingTax(false);
                }
            }
        };
        fetchTax();
        return () => { isMounted = false; }; // Cleanup function
    }, []); // Hanya dijalankan sekali

    // --- PERHITUNGAN HARGA DENGAN PAJAK (useMemo) ---
    const subtotal = useMemo(() =>
        selectedItem
            .filter(item => item.countItem > 0)
            .reduce((acc, item) => {
                const hargaItem = parseFloat(item.harga) || 0;
                const jumlahItem = parseInt(item.countItem) || 0;
                return acc + (hargaItem * jumlahItem);
            }, 0),
        [selectedItem]
    );

    const pajakNominal = useMemo(() =>
        subtotal * (pajakPersen / 100),
        [subtotal, pajakPersen]
    );

    const totalHargaFinal = useMemo(() =>
        // Pastikan pembulatan jika diperlukan, misal ke 2 desimal
        // Math.round((subtotal + pajakNominal) * 100) / 100
        subtotal + pajakNominal,
        [subtotal, pajakNominal]
    );
    // --- AKHIR PERHITUNGAN HARGA ---

    // Handler submit
    const handlePlaceOrder = async () => {
        // ... (Validasi tetap sama) ...
        const validItems = selectedItem.filter(item => item.countItem > 0);
        if (validItems.length === 0) { alert("Keranjang kosong."); return; }
        if (!namaGuest.trim()) { alert("Nama harus diisi."); return; }
        if (activeButtonEatType === 1 && !lokasiPemesanan) { alert("Pilih tempat duduk."); return; }
        if (!paymentMethod) { alert("Pilih metode pembayaran."); return; }

        const orderDetailsForApi = {
            fnb_type: activeButtonEatType === 1 ? 'Dine In' : 'Takeaway',
            nama_guest: namaGuest.trim(),
            lokasi_pemesanan: activeButtonEatType === 1 ? lokasiPemesanan : null,
            metode_pembayaran: paymentMethod, // QRIS atau CASH
            subtotal: subtotal,
            pajak_persen: pajakPersen, // Kirim persen yang didapat dari API
            pajak_nominal: pajakNominal,
            total_harga_final: totalHargaFinal,
            detail_order: validItems.map(item => ({
                id_produk: item.id_produk,
                jumlah: item.countItem,
                harga_saat_order: parseFloat(item.harga) || 0,
                catatan_pesanan: item.note || null
            }))
        };

        try {
            console.log('Mengirim data order:', orderDetailsForApi);
            const result = await createOrder(orderDetailsForApi);
            console.log('Order berhasil dibuat:', result);

            if (result && result.datas) {
                console.log('DATA DARI SERVER (result.datas):', result.datas);
                localStorage.removeItem('selectedItem');
                navigate('/transaksi-selesai', { state: { transactionData: result.datas } });
            } else {
                alert('Terjadi masalah saat memproses pesanan di server.');
                console.error('Respons tidak valid dari server:', result);
            }
        } catch (error) {
            console.error("Error saat membuat pesanan:", error);
            alert(`Gagal membuat pesanan: ${error.message || 'Tidak dapat terhubung ke server.'}`);
        }
    };

    // Opsi pembayaran & lokasi
    const methods = [{ id: "QRIS", label: "QRIS" }, { id: "CASH", label: "Cash" }];
    const lokasiOptions = [
        { value: "ruangan meeting 01", label: "Ruangan Meeting 01" },
        { value: "ruangan meeting 02", label: "Ruangan Meeting 02" },
        { value: "ruangan meeting 03", label: "Ruangan Meeting 03" },
        { value: "space monitor", label: "Space Monitor" },
        { value: "open space", label: "Open Space" },
        { value: "lesehan", label: "Lesehan" },
        { value: "outdoor", label: "Outdoor" },
        { value: "homebro", label: "Homebro" },
    ];

    // Cek apakah form valid untuk enable/disable tombol submit
    const isFormValid = useMemo(() => {
        const hasItems = selectedItem.filter(i => i.countItem > 0).length > 0;
        const isNameValid = namaGuest.trim() !== '';
        const isLocationValid = activeButtonEatType === 2 || (activeButtonEatType === 1 && lokasiPemesanan !== '');
        const isPaymentValid = paymentMethod !== '';
        return hasItems && isNameValid && isLocationValid && isPaymentValid && !isLoadingTax;
    }, [selectedItem, namaGuest, activeButtonEatType, lokasiPemesanan, paymentMethod, isLoadingTax]);

    return (
        // Gunakan flexbox untuk layout utama
        <div className="flex flex-col h-screen bg-white">
            {/* Header Tetap */}
            <div className="px-4 pt-2 pb-3 border-b border-gray-200 sticky top-0 bg-white z-10">
                <div className="flex items-center">
                    <button
                        className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition"
                        onClick={() => navigate(-1)}
                        aria-label="Kembali"
                    >
                        <FaChevronLeft className="text-gray-700 text-xl" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900 ml-2">
                        Detail Pesanan & Pembayaran
                    </h1>
                </div>
            </div>

            {/* Konten Scrollable */}
            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28"> {/* Beri padding bottom agar tidak tertutup tombol fixed */}

                {/* Tampilkan error jika gagal fetch pajak */}
                {errorTax && <Alert message={errorTax} type="warning" showIcon className="mb-4"/>}

                {/* Pilihan Dine In / Take Away */}
                <div className='flex justify-evenly pb-4 border-b border-gray-100 mb-4'>
                    {/* Dine In Button */}
                    <div className='flex flex-col items-center space-y-2'>
                        <img src="./img/dine-in.png" alt="Dine In" className="w-20 h-20 md:w-24 md:h-24 p-1" />
                        <button
                            onClick={() => setActiveButtonEatType(1)}
                            className={`text-sm w-32 h-9 flex items-center justify-center rounded-full shadow-md transition-colors ${activeButtonEatType === 1 ? "bg-testPrimary text-white font-semibold" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"}`}
                        >
                            Makan di Tempat
                            <FaChevronRight className="ml-1 text-xs"/>
                        </button>
                    </div>
                    {/* Take Away Button */}
                    <div className='flex flex-col items-center space-y-2'>
                        <img src="./img/take-away.png" alt="Take Away" className="w-20 h-20 md:w-24 md:h-24 p-1" />
                        <button
                            onClick={() => setActiveButtonEatType(2)}
                            className={`text-sm w-32 h-9 flex items-center justify-center rounded-full shadow-md transition-colors ${activeButtonEatType === 2 ? "bg-testPrimary text-white font-semibold" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"}`}
                        >
                            Bawa Pulang
                            <FaChevronRight className="ml-1 text-xs"/>
                        </button>
                    </div>
                </div>

                {/* Form Input */}
                <div className="space-y-4">
                    {/* Input Nama Pemesan */}
                    <div>
                        <label htmlFor="namaGuest" className="font-semibold text-gray-700 block mb-1 text-sm">Nama Pemesan*</label>
                        <input
                            id="namaGuest"
                            type="text"
                            value={namaGuest}
                            onChange={(e) => setNamaGuest(e.target.value)}
                            placeholder="Masukkan nama Anda"
                            className="w-full bg-gray-50 border border-gray-300 px-3 py-2 rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-testPrimary text-sm"
                            required
                        />
                    </div>

                    {/* Input Tempat (hanya jika Dine In) */}
                    {activeButtonEatType === 1 && (
                        <div>
                            <label htmlFor="lokasiPemesanan" className="font-semibold text-gray-700 block mb-1 text-sm">Pilih Tempat Duduk*</label>
                            <select
                                id="lokasiPemesanan"
                                value={lokasiPemesanan}
                                onChange={(e) => setLokasiPemesanan(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-300 px-3 py-2 rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-testPrimary appearance-none text-sm"
                                required
                            >
                                <option value="" disabled>-- Pilih Lokasi --</option>
                                {lokasiOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Rincian Item Pesanan */}
                    <div>
                        <h2 className="text-base font-semibold text-gray-800 mb-2 pt-3 border-t border-gray-100 mt-4">Ringkasan Pesanan</h2>
                        {selectedItem.filter(item => item.countItem > 0).length > 0 ? (
                            <div className="space-y-3">
                                {selectedItem.filter(item => item.countItem > 0).map((item, index) => (
                                     <div key={index} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex justify-between items-start text-sm">
                                        <div className="flex-1 mr-2">
                                            <p className="font-semibold text-gray-800">
                                                {item.nama_produk}
                                                <span className="ml-1.5 text-xs font-normal text-white bg-testPrimary rounded-full px-1.5 py-0.5 align-middle">
                                                    x{item.countItem}
                                                </span>
                                            </p>
                                            {item.note && (
                                                <p className="text-xs text-gray-500 italic mt-1 pl-1">
                                                    "{item.note}"
                                                </p>
                                            )}
                                        </div>
                                        <p className="font-medium text-gray-700 whitespace-nowrap">
                                            {formatRupiah(parseFloat(item.harga * item.countItem) || 0)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <p className="text-sm text-gray-500 italic text-center py-4">Belum ada item ditambahkan.</p>
                        )}
                    </div>

                    {/* Rincian Total Harga */}
                     <div className="mt-4 bg-gray-50 p-4 rounded-lg shadow-inner border border-gray-200 space-y-2">
                         {isLoadingTax ? (
                             <div className="text-center text-gray-500 py-4 flex items-center justify-center">
                                 <Spin size="small" className="mr-2"/> Menghitung total...
                             </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center text-sm text-gray-700">
                                    <span className="font-medium">Subtotal</span>
                                    <span className="font-medium">{formatRupiah(subtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-gray-700">
                                    <span className="font-medium">Pajak ({pajakPersen}%)</span>
                                    <span className="font-medium">{formatRupiah(pajakNominal)}</span>
                                </div>
                                <hr className="my-2 border-dashed"/>
                                <div className="flex justify-between items-center text-green-600 pt-1">
                                    <span className="text-lg font-bold">Total Pembayaran</span>
                                    <span className="text-lg font-bold">{formatRupiah(totalHargaFinal)}</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Pilihan Metode Pembayaran */}
                    <div>
                        <span className="font-semibold text-gray-700 block mb-2 pt-1.5 text-sm">Metode Pembayaran*</span>
                        <div className="space-y-2">
                            {methods.map((method) => (
                                <label
                                    key={method.id}
                                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border transition ${paymentMethod === method.id ? "border-testPrimary bg-red-50 ring-1 ring-testPrimary" : "border-gray-300 bg-white hover:bg-gray-50"}`}
                                >
                                    <span className={`font-medium text-sm ${paymentMethod === method.id ? 'text-testPrimary' : 'text-gray-700'}`}>{method.label}</span>
                                    <input
                                        type="radio" name="payment" value={method.id}
                                        checked={paymentMethod === method.id}
                                        onChange={() => setPaymentMethod(method.id)}
                                        className="form-radio h-4 w-4 text-testPrimary focus:ring-testPrimary"
                                        required
                                    />
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tombol Aksi Bawah Tetap */}
            <div className="p-4 border-t bg-white sticky bottom-0 left-0 right-0 w-full z-10">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-base font-semibold">Total Harga:</span>
                    <span className="text-lg font-bold text-testPrimary">
                        {isLoadingTax ? <Spin size="small"/> : formatRupiah(totalHargaFinal)}
                    </span>
                </div>
                <button
                    onClick={handlePlaceOrder}
                    disabled={!isFormValid} // Gunakan state isFormValid
                    className={`w-full text-white rounded-lg px-5 py-3 shadow-md font-semibold text-base transition ${
                        !isFormValid
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-testPrimary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
                    }`}
                >
                    Konfirmasi & Buat Pesanan
                </button>
            </div>
        </div>
        
    )
}

export default PaymentPelanggan;