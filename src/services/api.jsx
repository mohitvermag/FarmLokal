const API_URL = "https://fakestoreapi.com/products";

export async function fetchUsers() {
    const response = await fetch(API_URL);
    return await response.json();
}
