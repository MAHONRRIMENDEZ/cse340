function togglePassword() {
    const pwField = document.getElementById("account_password")
    pwField.type = pwField.type === "password" ? "text" : "password"
}
