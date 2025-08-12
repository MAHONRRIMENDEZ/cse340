function togglePassword() {
    const pwField = document.getElementById("account_password")
    pwField.type = pwField.type === "password" ? "text" : "password"
}
/*

  // Validación básica cliente
    document.getElementById('addInventoryForm').addEventListener('submit', function(event) {
        const yearInput = this.inv_year;
        const priceInput = this.inv_price;
        const milesInput = this.inv_miles;
        const colorInput = this.inv_color;

    if (yearInput.value < 1900 || yearInput.value > new Date().getFullYear() + 1) {
        alert('Year must be between 1900 and next year.');
        yearInput.focus();
        event.preventDefault();
        return;
    }
    if (priceInput.value < 0) {
        alert('Price must be a positive number.');
        priceInput.focus();
        event.preventDefault();
        return;
    }
    if (milesInput.value < 0) {
        alert('Miles must be a positive integer.');
        milesInput.focus();
        event.preventDefault();
        return;
    }
    if (colorInput.value.length < 3) {
        alert('Color must be at least 3 characters long.');
        colorInput.focus();
        event.preventDefault();
        return;
    }
});
*/
