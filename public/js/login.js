const API_URL = "https://facility-saying-cattle-assuming.trycloudflare.com"; // Será trocado pelo iniciar.sh

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            Swal.fire({ icon: 'success', title: 'Entrando...', showConfirmButton: false, timer: 1000 })
                .then(() => window.location.href = 'dashboard.html');
        } else {
            Swal.fire({ icon: 'error', title: 'Erro', text: 'Credenciais inválidas' });
        }
    } catch (err) {
        console.error("Erro de conexão");
    }
});
