export const getMenu = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/v1/menu/read')
        const data = await response.json()
        return data
    } catch (error) {
        throw error
    }
}