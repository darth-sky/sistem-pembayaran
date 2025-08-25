import React, { useEffect, useState } from 'react'
import { CiSearch, CiShoppingCart } from 'react-icons/ci'
import { Divider, Input, Drawer, FloatButton, Badge } from 'antd';
import MenuCard from '../../components/MenuItem';
import MenuItem from '../../components/MenuItem';
import { getMenu } from '../../services/api';
import DetailAddMenu from '../../components/Detail_AddMenu';
import { Link } from 'react-router-dom';

const MenuPelanggan = () => {


    const [open, setOpen] = useState(false);

    const [menu, setMenu] = useState([]);
    const [countItem, setCountItem] = useState(0)
    const [selectedItem, setSelectedItem] = useState(() =>{
        const store = localStorage.getItem('selectedItem');
        return store ? JSON.parse(store) : [];
    });

    const [detailMenu, setDetailMenu] = useState({})

    let totalCount = 0;

    selectedItem.forEach((item) => {
        totalCount += item.countItem;
    });

    useEffect(() =>{
        localStorage.setItem('selectedItem', JSON.stringify(selectedItem));
    }, [selectedItem])

    const addOrUpdateItem = async (newMenu, count) =>{
        setSelectedItem((prevItems) => {
            const existingItem = prevItems.find((item) => item.id_menu === newMenu.id_menu);
            if (existingItem) {
                const updatedItems = prevItems.map((item) =>
                    item.id_menu === newMenu.id_menu ? { ...item, countItem: item.countItem + count } : item
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


    return (
        <>
            <div className='bg-[#F5CB58] p-2 flex flex-col justify-center items-center gap-2'>
                <Input placeholder="Cari Makanan..." prefix={<CiSearch />} />

                <h3 className='text-white text-4xl' style={{ fontFamily: "'Lily Script One', cursive" }}>Homebro & Dapoer M.S</h3>

            </div>

            <div className='bg-[#F5CB58]'>
                <div className=" px-4 bg-white  rounded-tr-2xl rounded-tl-2xl ">
                    <div className="pt-4">

                        <div className='flex justify-between gap-2'>
                            <div className='flex flex-col justify-center items-center'>

                                <div className='p-2 bg-[#F3E9B5] rounded-lg w'>
                                    <CiShoppingCart size={30} className='text-[#E95322]' />
                                </div>
                                <p className='text-[#E95322]'>Snack</p>
                            </div>
                            <div className='flex flex-col justify-center items-center'>

                                <div className='p-2 bg-[#F3E9B5] rounded-lg w'>
                                    <CiShoppingCart size={30} className='text-[#E95322]' />
                                </div>
                                <p className='text-[#E95322]'>Snack</p>
                            </div>
                            <div className='flex flex-col justify-center items-center'>

                                <div className='p-2 bg-[#F3E9B5] rounded-lg w'>
                                    <CiShoppingCart size={30} className='text-[#E95322]' />
                                </div>
                                <p className='text-[#E95322]'>Snack</p>
                            </div>
                            <div className='flex flex-col justify-center items-center'>

                                <div className='p-2 bg-[#F3E9B5] rounded-lg w'>
                                    <CiShoppingCart size={30} className='text-[#E95322]' />
                                </div>
                                <p className='text-[#E95322]'>Snack</p>
                            </div>
                            <div className='flex flex-col justify-center items-center'>

                                <div className='p-2 bg-[#F3E9B5] rounded-lg w'>
                                    <CiShoppingCart size={30} className='text-[#E95322]' />
                                </div>
                                <p className='text-[#E95322]'>Snack</p>
                            </div>

                        </div>
                        <Divider className='bg-[#E95322]' />

                        <div>
                            <h1 className='text-black text-2xl' style={{ fontFamily: "'Lily Script One', cursive" }}>Coffee & Espresso</h1>
                            <div className="grid grid-cols-1 gap-2 pt-2">
                                {menu.map((item, index) => (
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

                        <div className='pt-4'>
                            <h1 className='text-black text-2xl' style={{ fontFamily: "'Lily Script One', cursive" }}>Mie & Dimsum</h1>
                            <div className="flex flex-col gap-2 pt-2">
                                {menu.map((item, index) => (
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
                    </div>
                </div>
            </div>
            <Drawer
                title="Basic Drawer"
                closable={{ 'aria-label': 'Close Button' }}
                onClose={onClose}
                open={open}
                placement="bottom"
                bodyStyle={{ paddingBottom: 80 }} // beri ruang di bawah untuk tombol
            >
                <DetailAddMenu
                    key={detailMenu.id}
                    image={detailMenu.foto_menu}
                    name={detailMenu.nama_menu}
                    description={detailMenu.deskripsi}
                    price={detailMenu.harga_menu}
                    setCountItem={setCountItem}
                    countItem={countItem}
                />

                <div className="fixed bottom-4 right-6">
                    <button
                        onClick={() => addOrUpdateItem(detailMenu, countItem)}
                        className="bg-[#E95322] text-white rounded-md px-5 py-2 shadow-md"
                    >
                        Tambahkan
                    </button>
                </div>
            </Drawer>
            <Link to="/keranjang-pelanggan">
            
            <FloatButton
                icon={
                    <Badge
                        count={totalCount}
                        size="small"
                        color="#E95322"
                        offset={[-2, 4]} // atur posisi angka
                    >
                        <CiShoppingCart size={26} className="text-[#E95322]" />
                    </Badge>
                }
                style={{
                    right: 24,
                    bottom: 24,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    backgroundColor: '#fff',
                    borderRadius: '50%',
                }}
            />
            </Link>
        </>
    )
}

export default MenuPelanggan