const API_URL = "https://facility-saying-cattle-assuming.trycloudflare.com"; // Será trocado pelo iniciar.sh

async function carregarOS() {
    const res = await fetch(`${API_URL}/api/os`);
    const dados = await res.json();
    const tabela = document.getElementById('tabelaOS');
    tabela.innerHTML = dados.map(os => `
        <tr>
            <td>${os.id}</td>
            <td>${os.cliente}</td>
            <td>${os.equipamento}</td>
            <td><span class="status-tag">${os.status}</span></td>
            <td>${os.data}</td>
        </tr>
    `).join('');
}

// Chamar ao carregar a página
document.addEventListener('DOMContentLoaded', carregarOS);
