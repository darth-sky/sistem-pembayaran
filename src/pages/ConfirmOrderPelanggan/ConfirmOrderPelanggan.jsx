import React, { useEffect, useState } from 'react'
import { CiSearch, CiShoppingCart } from 'react-icons/ci'
import { Divider, Input, Drawer, FloatButton, Badge } from 'antd';
import MenuCard from '../../components/MenuItem';
import MenuItem from '../../components/MenuItem';
import { getMenu } from '../../services/api';
import DetailAddMenu from '../../components/Detail_AddMenu';
import DetailKeranjang from '../../components/DetailKeranjang';
import { FaChevronLeft } from "react-icons/fa";
import { Link } from 'react-router-dom';

const ConfirmOrderPelanggan = () => {


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
                    item.id_produk === newMenu.id_produk
                        ? {
                            ...item,
                            countItem: item.countItem + count,
                            note: newMenu.note !== undefined ? newMenu.note : item.note || ""
                        }
                        : item
                );
                localStorage.setItem("selectedItem", JSON.stringify(updatedItems));
                return updatedItems;
            } else {
                const updatedItems = [
                    ...prevItems,
                    {
                        ...newMenu,
                        countItem: count,
                        note: newMenu.note !== undefined ? newMenu.note : ""
                    }
                ];
                localStorage.setItem("selectedItem", JSON.stringify(updatedItems));
                return updatedItems;
            }
        });
        onClose();
    };



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
                <div className="px-4 bg-white  h-[100vh] flex flex-col">
                    {/* Konten scrollable */}
                    <div className="pt-4 flex-1 overflow-y-auto">
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

                        <div className="flex flex-col gap-2 pt-2">
                            {selectedItem.filter(item => item.countItem > 0).map((item, index) => (
                                <DetailKeranjang
                                    key={index}
                                    image={item.foto_produk}
                                    name={item.nama_produk}
                                    description={item.deskripsi_produk}
                                    price={item.harga}
                                    countItem={item.countItem}
                                    note={item.note}
                                    setSelectedItem={setSelectedItem}
                                    id={item.id_produk}
                                />

                            ))}
                        </div>
                    </div>

                    {/* Bagian bawah */}
                    <div className="p-4 border-t bg-white">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-lg font-semibold">Total Harga:</span>
                            <span className="text-lg font-bold text-testPrimary">
                                Rp. {totalHarga.toLocaleString('id-ID')}
                            </span>
                        </div>
                        <Link to='/payment-pelanggan'>
                            <button
                                // onClick={() => addOrUpdateItem(detailMenu, countItem)}
                                className="bg-testPrimary text-white rounded-md px-5 py-2 shadow-md w-full"
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

export default ConfirmOrderPelanggan