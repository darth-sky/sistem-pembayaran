import React, { useEffect, useState } from 'react'
import { CiSearch, CiShoppingCart } from 'react-icons/ci'
import { Divider, Input, Drawer, FloatButton, Badge } from 'antd';
import MenuCard from '../../components/MenuItem';
import MenuItem from '../../components/MenuItem';
import { getMenu } from '../../services/api';
import DetailAddMenu from '../../components/Detail_AddMenu';
import DetailKeranjang from '../../components/DetailKeranjang';
import { Link } from 'react-router-dom';

const PaymentPelanggan = () => {


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
            <div className='bg-[#F5CB58] p-2 flex flex-col justify-center items-center gap-2'>
                <Input placeholder="Cari Makanan..." prefix={<CiSearch />} />

                <h3 className='text-white text-4xl' style={{ fontFamily: "'Lily Script One', cursive" }}>Homebro & Dapoer M.S</h3>

            </div>

            <div className='bg-[#F5CB58]'>
                <div className="px-4 bg-white rounded-tr-2xl rounded-tl-2xl h-[100dvh] flex flex-col relative">

                    <div>
                        <label className="font-bold block mb-1">Ruangan</label>
                        <div className="bg-[#F9F8E7] px-3 py-2 rounded-md text-gray-700">
                            Ruangan Meeting 01
                        </div>
                    </div>

                    <div>
                        <label className="font-bold block mb-1">Nama</label>
                        <div className="bg-[#F9F8E7] px-3 py-2 rounded-md text-gray-700">
                            Agun
                        </div>
                    </div>

                    <div className="flex justify-between items-center border-b pb-2">
                        <div>
                            <p>Strawberry Shake <span className="text-sm text-red-500">2 items</span></p>
                            <p>Broccoli Lasagna <span className="text-sm text-red-500">1 items</span></p>
                        </div>
                        <p className="text-lg font-bold text-gray-800">
                            Rp {totalHarga.toLocaleString('id-ID')}
                        </p>
                    </div>

                    <div className="flex justify-between items-center border-b pb-2">
                        <span className="font-semibold">Payment Method</span>
                        <span className="text-gray-500">QRIS **** 43/00/000</span>
                    </div>

                    {/* Delivery Time */}
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Estimated Delivery</span>
                        <span className="text-red-500 font-bold">25 mins</span>
                    </div>



                    {/* Bagian bawah */}
                    <div className="p-4 border-t bg-white absolute bottom-0 w-[92%]">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-lg font-semibold">Total Harga:</span>
                            <span className="text-lg font-bold text-[#E95322]">
                                Rp. {totalHarga.toLocaleString('id-ID')}
                            </span>
                        </div>
                        <Link to='/payment-pelanggan'>
                            <button
                                onClick={() => addOrUpdateItem(detailMenu, countItem)}
                                className="bg-[#E95322] text-white rounded-md px-5 py-2 shadow-md w-full"
                            >
                                Place Order
                            </button>
                        </Link>
                    </div>

                </div>
            </div>
        </>
    )
}

export default PaymentPelanggan