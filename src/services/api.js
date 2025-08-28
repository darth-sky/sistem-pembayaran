const api_url = 'http://172.16.81.134:5000/api/v1/'
const api_url_localhost = 'http://localhost:5000/api/v1/'

export const getMenu = async () => {
    try {
        const response = await fetch(api_url + `menu/read`)
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
export const getKategori = async (idMerchant = null) => {
    try {
        let url = api_url + `menu/kategori`;
        if (idMerchant) {
            url += `?id_merchant=${idMerchant}`;
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
        const response = await fetch(api_url + `menu/readByKategori?id_kategori=${idKategori}`);
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};
