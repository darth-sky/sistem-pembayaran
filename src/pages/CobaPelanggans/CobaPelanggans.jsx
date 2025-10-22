import React, { useEffect, useState, useRef } from 'react';
import { IoMdSearch } from "react-icons/io";
import { Drawer, Badge, Spin, Alert } from 'antd';
import MenuItem from '../../components/MenuItem';
import { getKategori, getMenuByCategory, getTenants } from '../../services/api';
import DetailAddMenu from '../../components/Detail_AddMenu';
import { Link } from 'react-router-dom';
import { FaShoppingBasket, FaChevronRight, FaStar } from "react-icons/fa"; // Import FaStar
import { TbBasketOff } from "react-icons/tb";
import './CobaPelanggan.css';
import DetailKeranjang from '../../components/DetailKeranjang';

const CobaMenuPelanggans = () => {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
    const [selectedMerchant, setSelectedMerchant] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [note, setNote] = useState("");

    const menuKategoriRefs = useRef({});
    const kategoriNavRefs = useRef({});
    const isClickScrolling = useRef(false);

    const handleSelectTenant = (tenantId) => {
        if (tenantId !== selectedMerchant) {
            setLoading(true);
            setSelectedMerchant(tenantId);
        }
    };

    const fetchKategoriByMerchant = async (idMerchant) => {
        try {
            setKategori([]); // Reset kategori
            setMenuByKategori({});
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
            } else {
                setActiveKategori(null);
            }
        } catch (error) {
            console.error(error);
            setError("Gagal memuat menu untuk tenant ini.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initialLoad = async () => {
            try {
                setLoading(true);
                const tenantData = await getTenants();
                if (tenantData.datas && tenantData.datas.length > 0) {
                    // PERBAIKAN 1: Tidak perlu 'enhancedTenants', langsung gunakan data dari API
                    setTenants(tenantData.datas);
                    setSelectedMerchant(tenantData.datas[0].id_tenant);
                } else {
                    setError("Tidak ada tenant yang tersedia.");
                    setLoading(false);
                }
            } catch (error) {
                console.error(error);
                setError("Gagal memuat daftar tenant.");
                setLoading(false);
            }
        };
        initialLoad();
    }, []);

    useEffect(() => {
        if (selectedMerchant) {
            fetchKategoriByMerchant(selectedMerchant);
        }
    }, [selectedMerchant]);

    // ... sisa useEffect dan fungsi lainnya tetap sama ...
    let totalCount = selectedItem.reduce((sum, item) => sum + item.countItem, 0);

    useEffect(() => {
        localStorage.setItem('selectedItem', JSON.stringify(selectedItem));
    }, [selectedItem]);

    useEffect(() => {
        if (isClickScrolling.current && activeKategori && menuKategoriRefs.current[activeKategori]) {
            const element = menuKategoriRefs.current[activeKategori];
            const offset = 25;
            const y = element.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
            setTimeout(() => { isClickScrolling.current = false; }, 500);
        }
    }, [activeKategori]);

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

    useEffect(() => {
        if (activeKategori && kategoriNavRefs.current[activeKategori]) {
            kategoriNavRefs.current[activeKategori].scrollIntoView({
                behavior: 'smooth', inline: 'center', block: 'nearest'
            });
        }
    }, [activeKategori]);

    const addOrUpdateItem = (newMenu, count, note) => {
        setSelectedItem(prevItems => {
            const existingItem = prevItems.find(item => item.id_produk === newMenu.id_produk);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id_produk === newMenu.id_produk
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
        setCountItem(1);
        setNote(menu.note || "");
        setOpen(true);
    };

    const onClose = () => {
        setCountItem(0);
        setOpen(false);
    };

    return (
        <>
            <div className="bg-white pb-[60px]">
                {/* PERBAIKAN: Layout baru untuk pemilihan tenant */}
                <div className="bg-white border-b sticky top-0 z-50">
                    <div className="flex overflow-x-auto px-2 scrollbar-hide">
                        {tenants.map((tenant) => (
                            <button
                                key={tenant.id_tenant}
                                onClick={() => handleSelectTenant(tenant.id_tenant)}
                                className={`flex-shrink-0 px-4 py-3 border-b-4 transition-all ${selectedMerchant === tenant.id_tenant
                                    ? 'border-testPrimary' // Ganti warna border sesuai tema Anda
                                    : 'border-transparent hover:border-gray-200'
                                    }`}
                            >
                                <div className="flex items-center gap-4"> {/* PERBAIKAN: Spasi lebih besar */}
                                    {/* PERBAIKAN: Ukuran gambar diubah dari w-10 h-10 menjadi w-14 h-14 */}
                                    <img
                                        src={`${import.meta.env.VITE_BASE_URL}/static/${tenant.gambar_tenant}`}
                                        alt={tenant.nama_tenant}
                                        className="w-14 h-14 rounded-full object-cover shadow-sm bg-gray-200"
                                    />
                                    <div className="text-left">
                                        {/* PERBAIKAN: Ukuran font diubah dari text-sm menjadi text-base */}
                                        <h3 className={`font-bold text-base ${selectedMerchant === tenant.id_tenant ? 'text-testPrimary' : 'text-gray-800'
                                            }`}>
                                            {tenant.nama_tenant}
                                        </h3>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="px-4">
                    {/* Navbar Kategori */}
                    <div className="sticky top-[73px] bg-white z-40"> {/* Disesuaikan agar di bawah navbar tenant */}
                        <div className="border-t border-b border-gray-200">
                            <div className='flex justify-start items-center gap-4 px-2 overflow-x-auto no-scrollbar py-2'>
                                <IoMdSearch size={24} className="text-black cursor-pointer flex-shrink-0" onClick={() => setShowSearch(!showSearch)} />
                                {showSearch && (
                                    <input type="text" placeholder="Cari produk..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border rounded px-2 py-1 text-sm" />
                                )}
                                {kategori.map(kat => (
                                    <div key={kat.id_kategori} ref={el => kategoriNavRefs.current[kat.id_kategori] = el}
                                        className={`cursor-pointer whitespace-nowrap pb-1 ${activeKategori === kat.id_kategori ? 'text-testPrimary font-semibold border-b-2 border-testPrimary' : 'text-black'}`}
                                        onClick={() => {
                                            isClickScrolling.current = true;
                                            setActiveKategori(kat.id_kategori);
                                        }}>
                                        <p className="leading-tight">{kat.nama_kategori}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Section Menu */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64"><Spin size="large" /></div>
                    ) : error ? (
                        <div className="text-center py-10"><Alert message="Error" description={error} type="error" showIcon /></div>
                    ) : (
                        <div className="grid grid-cols-1 gap-2">
                            {kategori.map(kat => (
                                <div key={kat.id_kategori} ref={el => menuKategoriRefs.current[kat.id_kategori] = el} className="mb-6 pt-2">
                                    <h1 className="text-black text-2xl font-semibold">{kat.nama_kategori}</h1>
                                    <div className="grid grid-cols-1 gap-2 pt-2">
                                        {menuByKategori[kat.id_kategori]
                                            ?.filter(item => (item?.nama_produk || "").toLowerCase().includes(searchTerm.toLowerCase()))
                                            .map((item, index) => (
                                                <MenuItem key={index} image={item.foto_produk} name={item.nama_produk} description={item.deskripsi_produk} price={item.harga} showDrawer={() => showDrawer(item)} />
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Drawer dan Footer tetap sama */}
            {/* ... */}
            <Drawer title="" closable={{ 'aria-label': 'Close Button' }} onClose={onClose} open={open} placement="bottom" style={{ body: { paddingBottom: 80 } }}>
                <DetailAddMenu key={detailMenu.id_produk} image={detailMenu.foto_produk} name={detailMenu.nama_produk} description={detailMenu.deskripsi_produk} price={detailMenu.harga} countItem={countItem} setCountItem={setCountItem} note={note} setNote={setNote} />
                <div className="fixed bottom-4 right-4 left-4">
                    <button onClick={() => addOrUpdateItem(detailMenu, countItem, note)} className="bg-testPrimary text-white rounded-md px-5 py-3 shadow-md w-full font-semibold">
                        Tambahkan ke Keranjang
                    </button>
                </div>
            </Drawer>

            {totalCount > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-testPrimary text-white px-4 py-3 flex justify-between items-center shadow-lg cursor-pointer" style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }} onClick={() => setOpenCart(true)}>
                    <Badge count={totalCount} size="small" color="#fff" style={{ color: '#1890ff', fontWeight: 'bold' }}>
                        <FaShoppingBasket size={28} className="text-white" />
                    </Badge>
                    <span className="text-lg font-semibold">Lihat Keranjang</span>
                    <FaChevronRight />
                </div>
            )}

            <Drawer title="Keranjang Pesanan" placement="bottom" closable={true} onClose={() => setOpenCart(false)} open={openCart} height="80vh">
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
                                    <DetailKeranjang key={index} image={item.foto_produk} name={item.nama_produk} description={item.deskripsi_produk} price={item.harga} countItem={item.countItem} note={item.note} setSelectedItem={setSelectedItem} id={item.id_produk} />
                                ))}
                            </div>
                        )}
                    </div>
                    {selectedItem.filter(item => item.countItem > 0).length > 0 && (
                        <div className="p-2 border-t bg-white sticky bottom-0">
                            <Link to="/confirm-order-pelanggan">
                                <button className="bg-testPrimary text-white rounded-md px-5 py-3 shadow-md w-full font-semibold">
                                    Lanjut ke Pembayaran
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