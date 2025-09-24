const api_url = 'http://127.0.0.1:5000/api/v1/'
const api_url_localhost = 'http://localhost:5000/api/v1/'

export const getMenu = async () => {
    try {
        const response = await fetch(api_url + `produk/read`)
        const data = await response.json()
        return data
    } catch (error) {
        throw error
    }
}



// COBA COBA LAGI
// export const getKategori = async () => {
//     try {
//         const response = await fetch(api_url + `menu/kategori`);
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         throw error;
//     }
// };
export const getKategori = async (idTenant = null) => {
    try {
        let url = api_url + `produk/kategori`;
        if (idTenant) {
            url += `?id_tenant=${idTenant}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};



export const getMenuByCategory = async (idKategori) => {
    try {
        const response = await fetch(api_url + `produk/readByKategori?id_kategori=${idKategori}`);
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};


export const createOrder = async (orderDetails) => {
    try {
        const response = await fetch(api_url + 'produk/create', { // Memanggil endpoint baru
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderDetails), // Mengirim data pesanan
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Gagal membuat pesanan.');
        }
        return data;
    } catch (error) {
        console.error("Error saat membuat pesanan:", error);
        throw error;
    }
};
