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

const TransaksiDone = () => {

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
            const existingItem = prevItems.find((item) => item.id === newMenu.id);
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

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const data = await getMenu();
                setMenu(data.datas);
            } catch (error) {
                console.error(error);
            }
        };
        fetchMenu();
    }, [])

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
        .reduce((acc, item) => acc + (item.harga_menu * item.countItem), 0);

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

            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="bg-white shadow-lg rounded-2xl p-6 w-[90%] max-w-md text-center">
                    {/* Gambar */}
                    <img
                        src="./img/transaksi-kasir.png"
                        alt="Transaksi Kasir"
                        className="w-28 h-28 mx-auto mb-4"
                    />

                    {/* Judul */}
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Silakan Ke Kasir
                    </h1>
                    <p className="text-gray-500 mb-6">
                        Selesaikan pembayaran Anda di kasir untuk memproses pesanan.
                    </p>

                    {/* Tombol Aksi */}
                    <div className="flex justify-center gap-4">
                        <Link to='/'>
                            <button
                                onClick={() => addOrUpdateItem(detailMenu, countItem)}
                                className="bg-testPrimary text-white rounded-md px-5 py-2 shadow-md w-full"
                            >
                                Kembali Ke Menu
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

        </>
    )
}

export default TransaksiDone