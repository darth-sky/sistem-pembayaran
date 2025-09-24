import React, { useEffect, useState } from 'react'
import { CiSearch, CiShoppingCart } from 'react-icons/ci'
import { Divider, Input, Drawer, FloatButton, Badge } from 'antd';
import MenuCard from '../../components/MenuItem';
import MenuItem from '../../components/MenuItem';
import { getMenu } from '../../services/api';
import DetailAddMenu from '../../components/Detail_AddMenu';
import DetailKeranjang from '../../components/DetailKeranjang';
import { Link } from 'react-router-dom';
import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../services/api';

const PaymentPelanggan = () => {

    const navigate = useNavigate();

    // 2. Buat handler untuk submit pesanan
    const handlePlaceOrder = async () => {
        // Validasi sederhana
        if (selectedItem.length === 0) {
            alert("Keranjang Anda kosong.");
            return;
        }
        if (!ruangan) { // State 'ruangan' digunakan untuk nama
            alert("Silakan isi nama Anda.");
            return;
        }
        if (!paymentMethod) {
            alert("Silakan pilih metode pembayaran.");
            return;
        }

        // 3. Siapkan data sesuai format yang akan diterima backend
        const orderDetails = {
            fnb_type: activeButtonEatType === 1 ? 'Dine In' : 'Takeaway',
            nama_guest: ruangan, // state 'ruangan' berisi nama pemesan
            lokasi_pemesanan: activeButtonEatType === 1 ? nama : null, // state 'nama' berisi lokasi/tempat
            metode_pembayaran: paymentMethod,
            total_harga_final: totalHarga,
            detail_order: selectedItem
                .filter(item => item.countItem > 0) // <-- TAMBAHKAN BARIS INI
                .map(item => ({
                    id_produk: item.id_produk,
                    jumlah: item.countItem,
                    harga_saat_order: item.harga,
                    catatan_pesanan: item.note || null
                }))
        };

        try {
            const result = await createOrder(orderDetails);
            console.log('Order berhasil dibuat:', result);

            // 4. Bersihkan keranjang di localStorage dan navigasi ke halaman sukses
            localStorage.removeItem('selectedItem');
            navigate('/transaksi-selesai', { state: { transactionData: result.datas } }); // Navigasi ke halaman sukses

        } catch (error) {
            alert(`Terjadi kesalahan: ${error.message}`);
        }
    };



    const [activeButtonEatType, setActiveButtonEatType] = useState(1);


    const [paymentMethod, setPaymentMethod] = useState("");

    const methods = [
        { id: "QRIS", label: "QRIS" },
        { id: "CASH", label: "Cash" },
    ];

    const [ruangan, setRuangan] = useState("");
    const [nama, setNama] = useState("");
    const [catatanPesanan, setCatatanPesanan] = useState("");


    const [open, setOpen] = useState(false);

    const [menu, setMenu] = useState([]);
    const [countItem, setCountItem] = useState(0)
    const [selectedItem, setSelectedItem] = useState(() => {
        const store = localStorage.getItem('selectedItem');
        return store ? JSON.parse(store) : [];
    });

    const [detailMenu, setDetailMenu] = useState({})

    useEffect(() => {
        localStorage.setItem('selectedItem', JSON.stringify(selectedItem));
    }, [selectedItem])

    const addOrUpdateItem = async (newMenu, count) => {
        setSelectedItem((prevItems) => {
            const existingItem = prevItems.find((item) => item.id_produk === newMenu.id_produk);
            if (existingItem) {
                const updatedItems = prevItems.map((item) =>
                    item.id === newMenu.id ? { ...item, countItem: item.countItem + count } : item
                );
                localStorage.setItem('selectedItem', JSON.stringify(updatedItems));
                return updatedItems;
            } else {
                const updatedItems = [...prevItems, { ...newMenu, countItem: count }];
                localStorage.setItem('selectedItem', JSON.stringify(updatedItems));
                return updatedItems;
            }
        })
        onClose();
    }

    // useEffect(() => {
    //     const fetchMenu = async () => {
    //         try {
    //             const data = await getMenu();
    //             setMenu(data.datas);
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };
    //     fetchMenu();
    // }, [])

    const showDrawer = (menu) => {
        setDetailMenu(menu)
        console.log({ detailMenunya: menu });

        setOpen(true);
    };
    const onClose = () => {
        setCountItem(0)
        setOpen(false);
    };

    const totalHarga = selectedItem
        .filter(item => item.countItem > 0)
        .reduce((acc, item) => acc + (item.harga * item.countItem), 0);


    return (
        <>
            {/* <div className='bg-[#E95322] p-2 flex flex-col justify-center items-center gap-2'>
                <h3
                    className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
                    style={{ fontFamily: "'Lily Script One', cursive" }}
                >
                    Homebro & Dapoer M.S
                </h3>

            </div> */}

            <div >
                <div className="px-4 bg-white  h-[100vh] flex flex-col relative">
                    <div className="flex items-center ">
                        <button
                            className="p-2 rounded-full hover:bg-gray-100 transition"
                            onClick={() => window.history.back()}
                        >
                            <FaChevronLeft className="text-gray-700 text-xl" />
                        </button>
                        <h1 className="text-lg font-semibold text-gray-900">
                            Confirm Order
                        </h1>
                    </div>
                    <div className='flex justify-evenly pb-3'>
                        <div className='flex flex-col items-center space-y-2'>
                            <img
                                src="./img/dine-in.png"
                                alt="Homebro"
                                className="w-[120px] h-[120px] sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 cursor-pointer rounded-full p-1"

                            />
                            <button
                                onClick={() => setActiveButtonEatType(1)}
                                className={`text-sm w-24 h-9 flex items-center justify-center rounded-4xl shadow-md hover:scale-110 transition-transform 
        ${activeButtonEatType === 1 ? "bg-testPrimary text-white" : "bg-white text-black border-2 border-testPrimary"}`
                                }
                            >
                                Dine In <FaChevronRight />
                            </button>

                        </div>

                        <div className='flex flex-col items-center space-y-2'>
                            <img
                                src="./img/take-away.png"
                                alt="Take Away"
                                className="w-[120px] h-[120px] sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 cursor-pointer rounded-md p-1"

                            />

                            <button
                                onClick={() => setActiveButtonEatType(2)}
                                className={`text-sm w-24 h-9 flex items-center justify-center rounded-4xl shadow-md hover:scale-110 transition-transform 
        ${activeButtonEatType === 2 ? "bg-testPrimary text-white" : "bg-white text-black border-2 border-testPrimary"}`
                                }
                            >
                                Take Away <FaChevronRight />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[calc(100vh-320px)] pr-2">

                        <div>
                            <label className="font-bold block mb-1">Nama</label>
                            <input
                                type="text"
                                value={ruangan}
                                onChange={(e) => setRuangan(e.target.value)}
                                className="w-full bg-[#F9F8E7] px-3 py-2 rounded-md text-gray-700"
                            />
                        </div>

                        {activeButtonEatType !== 2 && (
                            <div>
                                <label className="font-bold block mb-1">Tempat</label>
                                <select
                                    value={nama}
                                    onChange={(e) => setNama(e.target.value)}
                                    className="w-full bg-[#F9F8E7] px-3 py-2 rounded-md text-gray-700"
                                >
                                    <option value="">-- Pilih Tempat --</option>
                                    <option value="ruangan meeting 01">Ruangan Meeting 01</option>
                                    <option value="ruangan meeting 02">Ruangan Meeting 02</option>
                                    <option value="ruangan meeting 03">Ruangan Meeting 03</option>
                                    <option value="space monitor">Space Monitor</option>
                                    <option value="open space">Open Space</option>
                                    <option value="lesehan">Lesehan</option>
                                </select>
                            </div>
                        )}




                        <div className="space-y-3 pt-2">
                            {selectedItem.filter(item => item.countItem > 0).map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center"
                                >
                                    <div>
                                        <p className="font-semibold text-gray-800 text-base">
                                            {item.nama_produk}
                                            <span className="ml-1 text-xs text-white bg-red-500 rounded-full px-2 py-0.5">
                                                {item.countItem}
                                            </span>
                                        </p>
                                        {item.note && (
                                            <p className="text-sm text-gray-500 italic mt-1">
                                                Catatan: {item.note}
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-lg font-bold text-gray-800">
                                        Rp {parseInt(item.harga * item.countItem).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 bg-gray-50 p-4 rounded-xl flex justify-between items-center shadow-inner">
                            <span className="text-gray-700 font-medium">Total</span>
                            <span className="text-xl font-bold text-green-600">
                                Rp {totalHarga.toLocaleString('id-ID')}
                            </span>
                        </div>


                        <span className="font-semibold block mb-2 pt-1.5">Payment Method</span>
                        <div className="space-y-2">
                            {methods.map((method) => (
                                <label
                                    key={method.id}
                                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border transition
        ${paymentMethod === method.id ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"}`}
                                >
                                    <span className="text-gray-700 font-medium">{method.label}</span>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value={method.id}
                                        checked={paymentMethod === method.id}
                                        onChange={() => setPaymentMethod(method.id)}
                                        className="accent-blue-500 w-5 h-5"
                                    />
                                </label>
                            ))}
                        </div>

                    </div>




                    {/* Bagian bawah */}
                    <div className="p-4 border-t bg-white absolute bottom-0 w-[92%]">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-lg font-semibold">Total Harga:</span>
                            <span className="text-lg font-bold text-testPrimary">
                                Rp. {totalHarga.toLocaleString('id-ID')}
                            </span>
                        </div>
                        <button
                            onClick={handlePlaceOrder} // Ganti onClick ke handler yang benar
                            className="bg-testPrimary text-white rounded-md px-5 py-2 shadow-md w-full"
                        >
                            Place Order
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}

export default PaymentPelanggan