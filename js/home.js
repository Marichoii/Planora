document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.favorite-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            icon.classList.toggle('favorited');
            icon.classList.toggle('fa-regular');
            icon.classList.toggle('fa-solid');
        });
    });

    const profileIcon = document.querySelector('.profile-icon');
    const sidebarLogin = document.getElementById('sidebarLogin');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeModal = document.getElementById('closeModal');
    const closeRegisterModal = document.getElementById('closeRegisterModal');
    const openRegister = document.getElementById('openRegister');
    const backToLogin = document.getElementById('backToLogin');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    let loggedIn = false;

    function openLogin() {
        if (!loggedIn) {
            loginModal.classList.remove('hidden');
        }
    }

    profileIcon?.addEventListener('click', openLogin);

    sidebarLogin?.addEventListener('click', (e) => {
        e.preventDefault();
        if (loggedIn) {
            loggedIn = false;
            sidebarLogin.innerHTML = '<i class="fas fa-sign-in-alt"></i> Log In';
            alert('Logged out successfully.');
        } else {
            openLogin();
        }
    });

    // --- FECHAR modais ---
    closeModal?.addEventListener('click', () => loginModal.classList.add('hidden'));
    closeRegisterModal?.addEventListener('click', () => registerModal.classList.add('hidden'));

    // --- Trocar entre Login/Registro ---
    openRegister?.addEventListener('click', () => {
        loginModal.classList.add('hidden');
        registerModal.classList.remove('hidden');
    });

    backToLogin?.addEventListener('click', () => {
        registerModal.classList.add('hidden');
        loginModal.classList.remove('hidden');
    });

    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;

        if (user && pass) {
            loggedIn = true;
            sidebarLogin.innerHTML = '<i class="fas fa-sign-out-alt"></i> Log Out';
            loginModal.classList.add('hidden');
        }
    });

    registerForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const newUser = document.getElementById('newUsername').value;
        const newPass = document.getElementById('newPassword').value;

        if (newUser && newPass) {
            alert(`User "${newUser}" registered successfully.`);
            registerModal.classList.add('hidden');
            loginModal.classList.remove('hidden');
        }
    });
});
