/**
 * MAIN.JS - SISTEMA DE ORDEM DE SERVIÇO
 */

// --- NAVEGAÇÃO ---
function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('active');
}

async function showSection(sectionId) {
    document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');

    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const activeLink = document.getElementById(`link-${sectionId}`);
    if (activeLink) activeLink.classList.add('active');

    if (window.innerWidth <= 768) toggleMenu();

    if (sectionId === 'home') updateDashboardStats();
    if (sectionId === 'history') loadOS();
    if (sectionId === 'admin') loadUsers();
}

// --- DASHBOARD ---
async function updateDashboardStats() {
    try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        document.getElementById('stat-total').innerText = data.total || 0;
        document.getElementById('stat-abertas').innerText = data.abertas || 0;
        document.getElementById('stat-concluidas').innerText = (data.total - data.abertas) || 0;
    } catch (err) { console.error(err); }
}

// --- HISTÓRICO E AÇÕES ---
async function loadOS() {
    const lista = document.getElementById('listaOS');
    if (!lista) return;

    const res = await fetch('/api/os');
    const ordens = await res.json();

    lista.innerHTML = ordens.reverse().map(os => `
        <tr>
            <td>${os.data.split(' ')[0]}</td>
            <td><strong>${os.cliente}</strong></td>
            <td>${os.aparelho}</td>
            <td>R$ ${os.valor || '0,00'}</td>
            <td><span class="status-tag ${os.status === 'Concluído' ? 'tag-concluido' : ''}">${os.status}</span></td>
            <td>
                <div class="actions-flex">
                    <button class="btn-action btn-view" title="Ver" onclick="verDetalhes('${os.cliente}', '${os.descricao}')"><i class="fas fa-eye"></i></button>
                    <button class="btn-action btn-edit" title="Editar" onclick="editarOS(${os.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn-action btn-done" title="OK" onclick="concluirOS(${os.id})"><i class="fas fa-check"></i></button>
                    <button class="btn-action btn-delete" title="Excluir" onclick="excluirOS(${os.id})"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Ação de Concluir (OK)
async function concluirOS(id) {
    const result = await Swal.fire({
        title: 'Concluir Serviço?',
        text: "O status passará para Concluído.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        confirmButtonText: 'Sim, OK!',
        background: '#1e1e1e', color: '#fff'
    });

    if (result.isConfirmed) {
        const res = await fetch(`/api/os/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Concluído' })
        });

        if (res.ok) {
            Swal.fire({ icon: 'success', title: 'Sucesso!', background: '#1e1e1e', color: '#fff' });
            loadOS();
            updateDashboardStats();
        }
    }
}

function verDetalhes(cliente, desc) {
    Swal.fire({ title: cliente, text: desc, icon: 'info', background: '#1e1e1e', color: '#fff' });
}

async function excluirOS(id) {
    const result = await Swal.fire({
        title: 'Excluir?',
        text: "Isso é permanente!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        confirmButtonText: 'Excluir',
        background: '#1e1e1e', color: '#fff'
    });
    // Lógica de delete aqui...
}

// --- FORMULÁRIO NOVA OS ---
const formOS = document.getElementById('formOS');
if (formOS) {
    formOS.addEventListener('submit', async (e) => {
        e.preventDefault();
        const novaOS = {
            cliente: document.getElementById('cliente').value,
            aparelho: document.getElementById('aparelho').value,
            status: document.getElementById('status').value,
            valor: document.getElementById('valor').value,
            descricao: document.getElementById('descricao').value,
            data: new Date().toLocaleString('pt-BR')
        };

        const res = await fetch('/api/os', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novaOS)
        });

        if (res.ok) {
            Swal.fire({ icon: 'success', title: 'OS Salva!', background: '#1e1e1e', color: '#fff' });
            formOS.reset();
            showSection('home');
        }
    });
}

function filterOS() {
    const term = document.getElementById('searchOS').value.toLowerCase();
    document.querySelectorAll('#listaOS tr').forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(term) ? '' : 'none';
    });
}

window.onload = () => updateDashboardStats();
