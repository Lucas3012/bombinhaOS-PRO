/**
 * LOGIN.JS - SISTEMA BOMBINHA OS-PRO
 * Gerencia a autenticação e redirecionamento
 */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (!loginForm) {
        console.error("Erro: Formulário de login não encontrado no HTML.");
        return;
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Captura os valores dos campos
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Feedback visual de "Carregando" no botão
        const btn = loginForm.querySelector('button');
        const originalBtnText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Autenticando...';

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Sucesso no Login
                Swal.fire({
                    icon: 'success',
                    title: 'Acesso Autorizado!',
                    text: 'Bem-vindo ao Bombinha OS-PRO',
                    timer: 1500,
                    showConfirmButton: false,
                    background: '#1a1a1a',
                    color: '#fff',
                    iconColor: '#007bff'
                }).then(() => {
                    // Redireciona para o Dashboard
                    window.location.href = 'dashboard.html';
                });
            } else {
                // Erro de Credenciais
                Swal.fire({
                    icon: 'error',
                    title: 'Falha no Login',
                    text: data.message || 'E-mail ou senha incorretos.',
                    background: '#1a1a1a',
                    color: '#fff',
                    confirmButtonColor: '#007bff'
                });
                
                // Restaura o botão
                btn.disabled = false;
                btn.innerHTML = originalBtnText;
            }

        } catch (error) {
            console.error("Erro na requisição de login:", error);
            
            Swal.fire({
                icon: 'warning',
                title: 'Erro de Conexão',
                text: 'Não foi possível comunicar com o servidor. Verifique se o server.js está rodando.',
                background: '#1a1a1a',
                color: '#fff',
                confirmButtonColor: '#ffc107'
            });

            btn.disabled = false;
            btn.innerHTML = originalBtnText;
        }
    });
});
