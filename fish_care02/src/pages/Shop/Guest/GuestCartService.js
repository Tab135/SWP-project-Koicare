class GuestCartService {
  static GUEST_CART_KEY = "guest_cart";

  static getGuestCart() {
    const cartString = sessionStorage.getItem(this.GUEST_CART_KEY);
    return cartString ? JSON.parse(cartString) : [];
  }

  static addToGuestCart(product, quantity = 1) {
    const cart = this.getGuestCart();
    const existingItem = cart.find((item) => item.productId === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        productId: product.id,
        productName: product.productName,
        price: product.price,
        quantity: quantity,
        productImage: product.productImage,
      });
    }

    sessionStorage.setItem(this.GUEST_CART_KEY, JSON.stringify(cart));
    return cart;
  }

  static removeFromGuestCart(productId) {
    const cart = this.getGuestCart();
    const updatedCart = cart.filter((item) => item.productId !== productId);
    sessionStorage.setItem(this.GUEST_CART_KEY, JSON.stringify(updatedCart));
    return updatedCart;
  }

  static clearGuestCart() {
    sessionStorage.removeItem(this.GUEST_CART_KEY);
  }

  static getGuestCartCount() {
    const cart = this.getGuestCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }
}
export default GuestCartService;
