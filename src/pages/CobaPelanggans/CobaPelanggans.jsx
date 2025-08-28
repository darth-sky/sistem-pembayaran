import React, { useEffect, useState, useRef } from 'react';
import { IoMdSearch } from "react-icons/io";
import { Divider, Drawer, Badge } from 'antd';
import MenuItem from '../../components/MenuItem';
import { getKategori, getMenuByCategory } from '../../services/api';
import DetailAddMenu from '../../components/Detail_AddMenu';
import { Link } from 'react-router-dom';
import { FaShoppingBasket } from "react-icons/fa";
import { TbBasketOff } from "react-icons/tb";
import { FaChevronRight } from "react-icons/fa";
import './CobaPelanggan.css';
import DetailKeranjang from '../../components/DetailKeranjang';

const CobaMenuPelanggans = () => {
    const [kategori, setKategori] = useState([]);
    const [menuByKategori, setMenuByKategori] = useState({});
    const [activeKategori, setActiveKategori] = useState(null);
    const [open, setOpen] = useState(false);
    const [countItem, setCountItem] = useState(0);
    const [selectedItem, setSelectedItem] = useState(() => {
        const store = localStorage.getItem('selectedItem');
        return store ? JSON.parse(store) : [];
    });
    const [detailMenu, setDetailMenu] = useState({});
    const [openCart, setOpenCart] = useState(false);
    const [selectedMerchant, setSelectedMerchant] = useState(1); // default Homebro
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const menuKategoriRefs = useRef({});
    const kategoriNavRefs = useRef({});
    const kategoriContainerRef = useRef(null);
    const isClickScrolling = useRef(false);

    const [note, setNote] = useState("");


    const loadHomebro = () => {
        setSelectedMerchant(1);
        fetchKategoriByMerchant(1);
    };

    const loadDapoer = () => {
        setSelectedMerchant(2);
        fetchKategoriByMerchant(2);
    };

    const fetchKategoriByMerchant = async (idMerchant) => {
        try {
            const kategoriData = await getKategori(idMerchant);
            setKategori(kategoriData.datas);

            let menuDataObj = {};
            for (let kat of kategoriData.datas) {
                const menuData = await getMenuByCategory(kat.id_kategori);
                menuDataObj[kat.id_kategori] = menuData.datas;
            }
            setMenuByKategori(menuDataObj);

            if (kategoriData.datas.length > 0) {
                setActiveKategori(kategoriData.datas[0].id_kategori);
            }
        } catch (error) {
            console.error(error);
        }
    };

    let totalCount = selectedItem.reduce((sum, item) => sum + item.countItem, 0);

    useEffect(() => {
        localStorage.setItem('selectedItem', JSON.stringify(selectedItem));
    }, [selectedItem]);

    useEffect(() => {
        fetchKategoriByMerchant(1);
    }, []);

    // Scroll vertikal ke section menu saat klik kategori
    useEffect(() => {
        if (isClickScrolling.current && activeKategori && menuKategoriRefs.current[activeKategori]) {
            const element = menuKategoriRefs.current[activeKategori];
            const offset = 25;
            const y = element.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
            setTimeout(() => {
                isClickScrolling.current = false;
            }, 500);
        }
    }, [activeKategori]);

    // Highlight kategori saat scroll manual
    useEffect(() => {
        const handleScroll = () => {
            if (isClickScrolling.current) return;
            const scrollPos = window.scrollY + 120;
            let current = activeKategori;
            for (let kat of kategori) {
                const section = menuKategoriRefs.current[kat.id_kategori];
                if (section) {
                    const top = section.offsetTop;
                    const bottom = top + section.offsetHeight;
                    if (scrollPos >= top && scrollPos < bottom) {
                        current = kat.id_kategori;
                        break;
                    }
                }
            }
            if (current !== activeKategori) setActiveKategori(current);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [kategori, activeKategori]);

    // Scroll horizontal otomatis pada navbar kategori
    useEffect(() => {
        if (activeKategori && kategoriNavRefs.current[activeKategori]) {
            kategoriNavRefs.current[activeKategori].scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest'
            });
        }
    }, [activeKategori]);

    const addOrUpdateItem = (newMenu, count, note) => {
        setSelectedItem(prevItems => {
            const existingItem = prevItems.find(item => item.id_menu === newMenu.id_menu);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id_menu === newMenu.id_menu
                        ? { ...item, countItem: item.countItem + count, note }
                        : item
                );
            } else {
                return [...prevItems, { ...newMenu, countItem: count, note: note || "" }];

            }
        });
        onClose();
    };



    const showDrawer = (menu) => {
        setDetailMenu(menu);
        // Reset jumlah dan note saat buka menu baru
        setCountItem(0);
        setNote(menu.note || "");
        setOpen(true);
    };

    const onClose = () => {
        setCountItem(0);
        setOpen(false);
    };

    return (
        <>
            {/* Header */}
            <div className='bg-[#e67327] p-2 flex flex-col justify-center items-center gap-2'>
                <h3
                    className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
                    style={{ fontFamily: "'Lily Script One', cursive" }}
                >
                    Homebro & Dapoer M.S
                </h3>
            </div>

            {/* Kategori Navbar */}
            <div className='bg-[#e67327]'>
                <div className="px-4 bg-white rounded-tr-2xl rounded-tl-2xl pb-[60px]">
                    <div className="pt-4">
                        {/* Logo Merchant */}
                        <div className='flex justify-evenly pb-3'>
                            <div className='flex flex-col items-center space-y-2'>
                                <img
                                    src="./img/homebro.png"
                                    alt="Homebro"
                                    className="w-[120px] h-[120px] cursor-pointer rounded-md p-1"
                                    onClick={() => console.log('homebro')}
                                />
                                <button
                                    onClick={loadHomebro}
                                    className={`${selectedMerchant === 1
                                        ? "bg-[#E95322] text-black"
                                        : "bg-white text-black border-2 border-[#E95322]"
                                        } text-sm w-24 h-9 flex items-center justify-center rounded-4xl shadow-md hover:scale-110 transition-transform`}
                                >
                                    View Menu <FaChevronRight />
                                </button>
                            </div>
                            <div className='flex flex-col items-center space-y-2'>
                                <img
                                    src="./img/dapoer.png"
                                    alt="Dapoer"
                                    className="w-[120px] h-[120px] cursor-pointer rounded-md p-1"
                                    onClick={() => console.log('dapoer')}
                                />
                                <button
                                    onClick={loadDapoer}
                                    className={`${selectedMerchant === 2
                                        ? "bg-[#E95322] text-black"
                                        : "bg-white text-black border-2 border-[#E95322]"
                                        } text-sm w-24 h-9 flex items-center justify-center rounded-4xl shadow-md hover:scale-110 transition-transform`}
                                >
                                    View Menu <FaChevronRight />
                                </button>
                            </div>
                        </div>

                        {/* Navbar Kategori */}
                        <div className="sticky top-0 bg-white z-50">
                            <div className="border-t border-b border-gray-300">
                                <div
                                    className='flex justify-start gap-4 px-4 overflow-x-auto no-scrollbar'
                                    ref={kategoriContainerRef}
                                >
                                    <IoMdSearch
                                        size={24}
                                        className="text-black cursor-pointer relative z-10 flex-shrink-0"
                                        onClick={() => setShowSearch(!showSearch)}
                                    />
                                    {showSearch && (
                                        <input
                                            type="text"
                                            placeholder="Cari produk..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="border rounded px-2 py-1 text-sm"
                                        />
                                    )}

                                    {kategori.map(kat => (
                                        <div
                                            key={kat.id_kategori}
                                            ref={el => kategoriNavRefs.current[kat.id_kategori] = el}
                                            className={`flex flex-col justify-center items-center cursor-pointer whitespace-nowrap pb-0
                                                    ${activeKategori === kat.id_kategori
                                                    ? 'text-[#E95322] border-b-2 '
                                                    : 'text-black'}`}
                                            onClick={() => {
                                                isClickScrolling.current = true;
                                                setActiveKategori(kat.id_kategori);
                                            }}
                                        >
                                            <p className="leading-tight">{kat.nama_kategori}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Section Menu */}
                        <div className="grid grid-cols-1 gap-2">
                            {kategori.map(kat => (
                                <div
                                    key={kat.id_kategori}
                                    ref={el => menuKategoriRefs.current[kat.id_kategori] = el}
                                    className="mb-6"
                                >
                                    <h1 className="text-black text-2xl font-semibold">{kat.nama_kategori}</h1>
                                    <div className="grid grid-cols-1 gap-2 pt-2">
                                        {menuByKategori[kat.id_kategori]
                                            ?.filter(item =>
                                                item.nama_menu.toLowerCase().includes(searchTerm.toLowerCase())
                                            )
                                            .map((item, index) => (
                                                <MenuItem
                                                    key={index}
                                                    image={item.foto_menu}
                                                    name={item.nama_menu}
                                                    description={item.deskripsi}
                                                    price={item.harga_menu}
                                                    showDrawer={() => showDrawer(item)}
                                                />
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Drawer Menu Detail */}
            <Drawer
                title=""
                closable={{ 'aria-label': 'Close Button' }}
                onClose={onClose}
                open={open}
                placement="bottom"
                Style={{ body: { paddingBottom: 80 } }}
            >
                <DetailAddMenu
                    key={detailMenu.id}
                    image={detailMenu.foto_menu}
                    name={detailMenu.nama_menu}
                    description={detailMenu.deskripsi}
                    price={detailMenu.harga_menu}
                    countItem={countItem}
                    setCountItem={setCountItem}
                    note={note}
                    setNote={setNote}
                />


                <div className="fixed bottom-4 right-6">
                    <button
                        onClick={() => addOrUpdateItem(detailMenu, countItem, note)}
                        className="bg-[#E95322] text-white rounded-md px-5 py-2 shadow-md"
                    >
                        Tambahkan
                    </button>


                </div>
            </Drawer>

            {/* Footer Keranjang */}
            <div
                className="fixed bottom-0 left-0 right-0 bg-[#E95322] text-white px-4 py-3 flex justify-between items-center shadow-lg"
                style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
                onClick={() => setOpenCart(true)}
            >
                <Badge size="small" color="#fff">
                    <FaShoppingBasket size={28} className="text-white" />
                </Badge>
                <span className="text-lg font-semibold">
                    Keranjang Pesanan ({totalCount})
                </span>
            </div>

            {/* Drawer Keranjang */}
            <Drawer
                title="Keranjang Pesanan"
                placement="bottom"
                closable={true}
                onClose={() => setOpenCart(false)}
                open={openCart}
                height="80vh"
            >
                <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto">
                        {selectedItem.filter(item => item.countItem > 0).length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <TbBasketOff size={64} />
                                <p className="mt-2 text-lg">Keranjang masih kosong</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {selectedItem.filter(item => item.countItem > 0).map((item, index) => (
                                    <DetailKeranjang
                                        key={index}
                                        image={item.foto_menu}
                                        name={item.nama_menu}
                                        description={item.deskripsi}
                                        price={item.harga_menu}
                                        countItem={item.countItem}
                                        note={item.note}
                                        setSelectedItem={setSelectedItem}
                                        id={item.id_menu}
                                    />


                                ))}
                            </div>
                        )}
                    </div>
                    {selectedItem.filter(item => item.countItem > 0).length > 0 && (
                        <div className="p-2 border-t bg-white sticky bottom-0">
                            <Link to="/confirm-order-pelanggan">
                                <button
                                    onClick={() => addOrUpdateItem(detailMenu, countItem)}
                                    className="bg-[#E95322] text-white rounded-md px-5 py-2 shadow-md w-full"
                                >
                                    Check Out
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </Drawer>
        </>
    );
};

export default CobaMenuPelanggans;
