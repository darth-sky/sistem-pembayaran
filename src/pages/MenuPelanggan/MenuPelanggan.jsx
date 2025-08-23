import React from 'react'
import { CiSearch, CiShoppingCart } from 'react-icons/ci'
import { Divider, Input } from 'antd';

const MenuPelanggan = () => {
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

                        <div className='grid grid-cols-4 pt-2 gap-4 md:grid-cols-6'>
                            <div className='bg-[url(./img/1-espresso.jpg)] h-[150px] bg-cover bg-center rounded-2xl relative '>
                                <h1 className='absolute bottom-0 right-0 bg-[#E95322] rounded-md p-[0.5px] text-white'>Rp. 20.000</h1>
                            </div>


                            <div className='bg-[url(./img/1-espresso.jpg)] h-[150px] bg-cover bg-center rounded-2xl'>
                            </div>
                            <div className='bg-[url(./img/1-espresso.jpg)] h-[150px] bg-cover bg-center rounded-2xl'>
                            </div>
                            <div className='bg-[url(./img/1-espresso.jpg)] h-[150px] bg-cover bg-center rounded-2xl'>
                            </div>
                        </div>
                    </div>

                    <div className='pt-4'>
                        <h1 className='text-black text-2xl' style={{ fontFamily: "'Lily Script One', cursive" }}>Coffee & Espresso</h1>

                        <div className='grid grid-cols-4 pt-2 gap-4 md:grid-cols-6'>
                            <div className='bg-[url(./img/1-espresso.jpg)] h-[150px] bg-cover bg-center rounded-2xl relative '>
                                <h1 className='absolute bottom-0 right-0 bg-[#E95322] rounded-md p-[0.5px] text-white'>Rp. 20.000</h1>
                            </div>


                            <div className='bg-[url(./img/1-espresso.jpg)] h-[150px] bg-cover bg-center rounded-2xl'>
                            </div>
                            <div className='bg-[url(./img/1-espresso.jpg)] h-[150px] bg-cover bg-center rounded-2xl'>
                            </div>
                            <div className='bg-[url(./img/1-espresso.jpg)] h-[150px] bg-cover bg-center rounded-2xl'>
                            </div>
                        </div>
                    </div>
                </div>
                    </div>
            </div>
        </>
    )
}

export default MenuPelanggan