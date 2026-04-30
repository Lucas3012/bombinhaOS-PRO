document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Login com Sucesso
            Swal.fire({
                icon: 'success',
                title: 'Acesso Autorizado!',
                text: 'Bem-vindo ao Bombinha OS-PRO',
                timer: 1500,
                showConfirmButton: false,
                background: '#1e1e1e',
                color: '#fff'
            }).then(() => {
                window.location.href = '/dashboard.html';
            });
        } else {
            // Erro de Login
            Swal.fire({
                icon: 'error',
                title: 'Erro de Acesso',
                text: data.message || 'E-mail ou senha incorretos!',
                background: '#1e1e1e',
                color: '#fff',
                confirmButtonColor: '#007bff'
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'warning',
            title: 'Erro na Conexão',
            text: 'Não foi possível conectar ao servidor.',
            background: '#1e1e1e',
            color: '#fff'
        });
    }
});
