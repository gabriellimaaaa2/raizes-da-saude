// Configuração da API
const API_URL = 'http://localhost:3000/api';
let adminToken = '';
let currentPage = 1;
let currentSection = 'dashboard';

// Login
async function login() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    if (!username || !password) {
        alert('Por favor, insira o login e a senha');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) throw new Error('Login falhou');

        const data = await response.json();
        
        adminToken = data.token;
        localStorage.setItem('adminToken', adminToken);
        
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'flex';
        
        loadDashboard();
    } catch (error) {
        console.error('Erro no login:', error);
        alert('Login falhou. Verifique as credenciais.');
    }
}

// Logout
function logout() {
    localStorage.removeItem('adminToken');
    adminToken = '';
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
}

// Verificar se já está logado
window.onload = function() {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
        adminToken = savedToken;
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'flex';
        loadDashboard();
    }
};

// Headers para requisições
function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'X-Admin-Token': adminToken
    };
}

// Mostrar seção
function showSection(section) {
    currentSection = section;
    
    // Remover active de todos os nav-items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Adicionar active no item clicado
    event.target.classList.add('active');
    
    // Esconder todas as seções
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    // Mostrar seção selecionada
    document.getElementById(section + 'Section').classList.add('active');
    
    // Carregar dados da seção
    if (section === 'dashboard') {
        loadDashboard();
    } else if (section === 'receitas') {
        loadCategoriesForFilter();
        buscarReceitas();
    } else if (section === 'categorias') {
        loadCategorias();
    } else if (section === 'usuarios') {
        buscarUsuarios();
    }
}

// ============ DASHBOARD ============

async function loadDashboard() {
    try {
        const response = await fetch(`${API_URL}/admin/dashboard`, {
            headers: getHeaders()
        });
        
        if (!response.ok) throw new Error('Erro ao carregar dashboard');
        
        const data = await response.json();
        
        // Atualizar estatísticas
        document.getElementById('totalUsuarios').textContent = data.totalUsuarios;
        document.getElementById('totalReceitas').textContent = data.totalReceitas;
        document.getElementById('totalCategorias').textContent = data.totalCategorias;
        document.getElementById('totalAssinaturasAtivas').textContent = data.totalAssinaturasAtivas;
        document.getElementById('totalGanhos').textContent = `R$ ${data.totalGanhos.replace('.', ',')}`;
        
        // Usuários por plano
        const usuariosPorPlanoDiv = document.getElementById('usuariosPorPlano');
        usuariosPorPlanoDiv.innerHTML = '';
        for (const [plano, count] of Object.entries(data.usuariosPorPlano)) {
            usuariosPorPlanoDiv.innerHTML += `
                <div class="chart-item">
                    <span class="chart-label">${plano.charAt(0).toUpperCase() + plano.slice(1)}</span>
                    <span class="chart-value">${count}</span>
                </div>
            `;
        }
        
        // Receitas por tipo
        const receitasPorTipoDiv = document.getElementById('receitasPorTipo');
        receitasPorTipoDiv.innerHTML = '';
        for (const [tipo, count] of Object.entries(data.receitasPorTipo)) {
            receitasPorTipoDiv.innerHTML += `
                <div class="chart-item">
                    <span class="chart-label">${tipo.charAt(0).toUpperCase() + tipo.slice(1)}</span>
                    <span class="chart-value">${count}</span>
                </div>
            `;
        }

        // Assinaturas Vencendo
        const assinaturasVencendoBody = document.querySelector('#assinaturasVencendo tbody');
        assinaturasVencendoBody.innerHTML = data.assinaturasVencendo.map(sub => `
            <tr>
                <td>${sub.usuarios.nome}</td>
                <td>${sub.usuarios.email}</td>
                <td><span class="badge badge-${sub.plano_nome}">${sub.plano_nome}</span></td>
                <td>${new Date(sub.data_expiracao).toLocaleDateString('pt-BR')}</td>
            </tr>
        `).join('') || '<tr><td colspan="4">Nenhuma assinatura vencendo nos próximos 7 dias.</td></tr>';
        
        // Últimos usuários
        const ultimosUsuariosDiv = document.getElementById('ultimosUsuarios');
        ultimosUsuariosDiv.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Plano</th>
                        <th>Cadastro</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.ultimosUsuarios.map(user => `
                        <tr>
                            <td>${user.nome}</td>
                            <td>${user.email}</td>
                            <td><span class="badge badge-${user.plano}">${user.plano}</span></td>
                            <td>${new Date(user.created_at).toLocaleDateString('pt-BR')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        alert('Erro ao carregar dashboard. Verifique a chave de administrador.');
    }
}

// ============ RECEITAS ============

async function buscarReceitas(page = 1) {
    currentPage = page;
    const busca = document.getElementById('receitaBusca').value;
    const categoria = document.getElementById('receitaCategoria').value;
    
    try {
        let url = `${API_URL}/admin/receitas?page=${page}&limit=20`;
        if (busca) url += `&busca=${busca}`;
        if (categoria) url += `&categoria=${categoria}`;
        
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) throw new Error('Erro ao buscar receitas');
        
        const data = await response.json();
        
        // Renderizar tabela
        const tableDiv = document.getElementById('receitasTable');
        tableDiv.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Categoria</th>
                        <th>Tipo</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.receitas.map(receita => `
                        <tr>
                            <td>${receita.nome}</td>
                            <td>${receita.categorias?.nome || 'N/A'}</td>
                            <td>${receita.tipo}</td>
                            <td>
                                <button class="btn-primary btn-small" onclick="editarReceita(${receita.id})">Editar</button>
                                <button class="btn-danger btn-small" onclick="deletarReceita(${receita.id})">Deletar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        // Renderizar paginação
        renderPagination('receitasPagination', data.page, data.totalPages, buscarReceitas);
    } catch (error) {
        console.error('Erro ao buscar receitas:', error);
        alert('Erro ao buscar receitas');
    }
}

async function loadCategoriesForFilter() {
    try {
        const response = await fetch(`${API_URL}/admin/categorias`, { headers: getHeaders() });
        if (!response.ok) throw new Error('Erro ao buscar categorias');
        
        const categorias = await response.json();
        const select = document.getElementById('receitaCategoria');
        select.innerHTML = '<option value="">Todas as categorias</option>';
        categorias.forEach(cat => {
            select.innerHTML += `<option value="${cat.id}">${cat.nome}</option>`;
        });
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
    }
}

function showReceitaModal(id = null) {
    document.getElementById('receitaModal').style.display = 'block';
    document.getElementById('receitaForm').reset();
    document.getElementById('receitaId').value = '';
    document.getElementById('receitaModalTitle').textContent = 'Nova Receita';
    
    // Carregar categorias no select
    loadCategoriesForReceitaForm();
    
    if (id) {
        document.getElementById('receitaModalTitle').textContent = 'Editar Receita';
        loadReceitaData(id);
    }
}

async function loadCategoriesForReceitaForm() {
    try {
        const response = await fetch(`${API_URL}/admin/categorias`, { headers: getHeaders() });
        const categorias = await response.json();
        const select = document.getElementById('receitaCategoriaId');
        select.innerHTML = '';
        categorias.forEach(cat => {
            select.innerHTML += `<option value="${cat.id}">${cat.nome}</option>`;
        });
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
    }
}

async function loadReceitaData(id) {
    try {
        const response = await fetch(`${API_URL}/admin/receitas/${id}`, { headers: getHeaders() });
        const receita = await response.json();
        
        document.getElementById('receitaId').value = receita.id;
        document.getElementById('receitaNome').value = receita.nome;
        document.getElementById('receitaCategoriaId').value = receita.categoria_id;
        document.getElementById('receitaTipo').value = receita.tipo;
        document.getElementById('receitaDescricao').value = receita.descricao || '';
        document.getElementById('receitaIndicacoes').value = receita.indicacoes || '';
        document.getElementById('receitaIngredientes').value = JSON.stringify(receita.ingredientes, null, 2);
        document.getElementById('receitaModoPreparo').value = receita.modo_preparo || '';
        document.getElementById('receitaComoTomar').value = receita.como_tomar || '';
        document.getElementById('receitaQuandoTomar').value = receita.quando_tomar || '';
        document.getElementById('receitaContraindicacoes').value = receita.contraindicacoes || '';
        document.getElementById('receitaObservacoes').value = receita.observacoes || '';
        document.getElementById('receitaTempoPreparo').value = receita.tempo_preparo || '';
        document.getElementById('receitaValidade').value = receita.validade || '';
        document.getElementById('receitaImagemUrl').value = receita.imagem_url || '';
        document.getElementById('receitaTags').value = receita.tags ? receita.tags.join(', ') : '';
        document.getElementById('receitaPreco').value = receita.preco || 0.00;
        document.getElementById('receitaEstoque').value = receita.estoque || 0;
        document.getElementById('receitaPreparoDetalhado').value = receita.preparo_detalhado || '';
    } catch (error) {
        console.error('Erro ao carregar receita:', error);
        alert('Erro ao carregar receita');
    }
}

function closeReceitaModal() {
    document.getElementById('receitaModal').style.display = 'none';
}

async function editarReceita(id) {
    showReceitaModal(id);
}

async function deletarReceita(id) {
    if (!confirm('Tem certeza que deseja deletar esta receita?')) return;
    
    try {
        const response = await fetch(`${API_URL}/admin/receitas/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        
        if (!response.ok) throw new Error('Erro ao deletar receita');
        
        alert('Receita deletada com sucesso!');
        buscarReceitas(currentPage);
    } catch (error) {
        console.error('Erro ao deletar receita:', error);
        alert('Erro ao deletar receita');
    }
}

// Form submit
document.getElementById('receitaForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('receitaId').value;
    const tags = document.getElementById('receitaTags').value;
    
    let ingredientes;
    try {
        ingredientes = JSON.parse(document.getElementById('receitaIngredientes').value);
    } catch (error) {
        alert('Formato JSON inválido nos ingredientes');
        return;
    }
    
const data = {
        categoria_id: document.getElementById('receitaCategoriaId').value,
        nome: document.getElementById('receitaNome').value,
        descricao: document.getElementById('receitaDescricao').value,
        tipo: document.getElementById('receitaTipo').value,
        indicacoes: document.getElementById('receitaIndicacoes').value,
        ingredientes: JSON.parse(document.getElementById('receitaIngredientes').value),
        modo_preparo: document.getElementById('receitaModoPreparo').value,
        como_tomar: document.getElementById('receitaComoTomar').value,
        quando_tomar: document.getElementById('receitaQuandoTomar').value,
        contraindicacoes: document.getElementById('receitaContraindicacoes').value,
        observacoes: document.getElementById('receitaObservacoes').value,
        tempo_preparo: document.getElementById('receitaTempoPreparo').value,
        validade: document.getElementById('receitaValidade').value,
        imagem_url: document.getElementById('receitaImagemUrl').value,
        tags: document.getElementById('receitaTags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
        preco: parseFloat(document.getElementById('receitaPreco').value),
        estoque: parseInt(document.getElementById('receitaEstoque').value),
        preparo_detalhado: document.getElementById('receitaPreparoDetalhado').value
    };
    
    try {
        const url = id ? `${API_URL}/admin/receitas/${id}` : `${API_URL}/admin/receitas`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error('Erro ao salvar receita');
        
        alert('Receita salva com sucesso!');
        closeReceitaModal();
        buscarReceitas(currentPage);
    } catch (error) {
        console.error('Erro ao salvar receita:', error);
        alert('Erro ao salvar receita');
    }
});

// ============ CATEGORIAS ============

async function loadCategorias() {
    try {
        const response = await fetch(`${API_URL}/admin/categorias`, { headers: getHeaders() });
        if (!response.ok) throw new Error('Erro ao buscar categorias');
        
        const categorias = await response.json();
        
        const gridDiv = document.getElementById('categoriasGrid');
        gridDiv.innerHTML = categorias.map(cat => `
            <div class="category-card">
                <div class="category-header">
                    <div class="category-icon">${cat.icone || '🌿'}</div>
                    <div class="category-name">${cat.nome}</div>
                </div>
                <div class="category-description">${cat.descricao || 'Sem descrição'}</div>
                <div class="category-actions">
                    <button class="btn-primary btn-small" onclick="editarCategoria(${cat.id})">Editar</button>
                    <button class="btn-danger btn-small" onclick="deletarCategoria(${cat.id})">Deletar</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        alert('Erro ao carregar categorias');
    }
}

function showCategoriaModal(id = null) {
    document.getElementById('categoriaModal').style.display = 'block';
    document.getElementById('categoriaForm').reset();
    document.getElementById('categoriaId').value = '';
    document.getElementById('categoriaModalTitle').textContent = 'Nova Categoria';
    
    if (id) {
        document.getElementById('categoriaModalTitle').textContent = 'Editar Categoria';
        loadCategoriaData(id);
    }
}

async function loadCategoriaData(id) {
    try {
        const response = await fetch(`${API_URL}/admin/categorias`, { headers: getHeaders() });
        const categorias = await response.json();
        const categoria = categorias.find(c => c.id === id);
        
        if (categoria) {
            document.getElementById('categoriaId').value = categoria.id;
            document.getElementById('categoriaNome').value = categoria.nome;
            document.getElementById('categoriaDescricao').value = categoria.descricao || '';
            document.getElementById('categoriaIcone').value = categoria.icone || '';
            document.getElementById('categoriaCor').value = categoria.cor || '#4CAF50';
        }
    } catch (error) {
        console.error('Erro ao carregar categoria:', error);
        alert('Erro ao carregar categoria');
    }
}

function closeCategoriaModal() {
    document.getElementById('categoriaModal').style.display = 'none';
}

async function editarCategoria(id) {
    showCategoriaModal(id);
}

async function deletarCategoria(id) {
    if (!confirm('Tem certeza que deseja deletar esta categoria?')) return;
    
    try {
        const response = await fetch(`${API_URL}/admin/categorias/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        
        if (!response.ok) throw new Error('Erro ao deletar categoria');
        
        alert('Categoria deletada com sucesso!');
        loadCategorias();
    } catch (error) {
        console.error('Erro ao deletar categoria:', error);
        alert('Erro ao deletar categoria');
    }
}

document.getElementById('categoriaForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('categoriaId').value;
    const data = {
        nome: document.getElementById('categoriaNome').value,
        descricao: document.getElementById('categoriaDescricao').value,
        icone: document.getElementById('categoriaIcone').value,
        cor: document.getElementById('categoriaCor').value
    };
    
    try {
        const url = id ? `${API_URL}/admin/categorias/${id}` : `${API_URL}/admin/categorias`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error('Erro ao salvar categoria');
        
        alert('Categoria salva com sucesso!');
        closeCategoriaModal();
        loadCategorias();
    } catch (error) {
        console.error('Erro ao salvar categoria:', error);
        alert('Erro ao salvar categoria');
    }
});

// ============ USUÁRIOS ============

async function buscarUsuarios(page = 1) {
    currentPage = page;
    const busca = document.getElementById('usuarioBusca').value;
    
    try {
        let url = `${API_URL}/admin/usuarios?page=${page}&limit=20`;
        if (busca) url += `&busca=${busca}`;
        
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) throw new Error('Erro ao buscar usuários');
        
        const data = await response.json();
        
        const tableDiv = document.getElementById('usuariosTable');
        tableDiv.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Plano</th>
                        <th>Expiração</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.usuarios.map(user => `
                        <tr>
                            <td>${user.nome}</td>
                            <td>${user.email}</td>
                            <td>${user.telefone || 'N/A'}</td>
                            <td><span class="badge badge-${user.plano}">${user.plano}</span></td>
                            <td>${user.data_expiracao_plano ? new Date(user.data_expiracao_plano).toLocaleDateString('pt-BR') : 'N/A'}</td>
                            <td>
                                <button class="btn-primary btn-small" onclick="editarUsuario(${user.id})">Editar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        renderPagination('usuariosPagination', data.page, data.totalPages, buscarUsuarios);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        alert('Erro ao buscar usuários');
    }
}

async function editarUsuario(id) {
    // Corrigir o problema do botão de edição:
    // 1. Limpar o campo de nova senha
    document.getElementById('usuarioNovaSenha').value = '';
    // 2. Garantir que o modal está fechado antes de abrir (evita bugs de estado)
    closeUsuarioModal();
    try {
        const response = await fetch(`${API_URL}/admin/usuarios/${id}`, { headers: getHeaders() });
        if (!response.ok) throw new Error('Erro ao buscar usuário');
        
        const user = await response.json();
        
        document.getElementById('usuarioId').value = user.id;
        document.getElementById('usuarioNome').value = user.nome;
        document.getElementById('usuarioEmail').value = user.email;
        document.getElementById('usuarioTelefone').value = user.telefone || '';
        document.getElementById('usuarioPlano').value = user.plano;
        
        // Preencher campos de IP para banimento
        document.getElementById('usuarioIpCadastro').value = user.ip_cadastro || 'N/A';
        document.getElementById('usuarioIpUltimoLogin').value = user.ip_ultimo_login || 'N/A';
        
        if (user.data_expiracao_plano) {
            const date = new Date(user.data_expiracao_plano);
            document.getElementById('usuarioDataExpiracao').value = date.toISOString().split('T')[0];
        }
        
        document.getElementById('usuarioModal').style.display = 'block';
        
        // Preencher o select de planos para dar plano
        const darPlanoSelect = document.getElementById('darPlanoNome');
        darPlanoSelect.innerHTML = PLANOS_DISPONIVEIS.map(p => `<option value="${p.nome}" data-dias="${p.dias}">${p.titulo}</option>`).join('');
        document.getElementById('darPlanoDias').value = PLANOS_DISPONIVEIS[0].dias; // Valor inicial
        document.getElementById('darPlanoNome').value = user.plano; // Selecionar o plano atual do usuário
    } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        alert('Erro ao carregar usuário');
    }
}

function closeUsuarioModal() {
    document.getElementById('usuarioModal').style.display = 'none';
}

async function deletarUsuario() {
    const id = document.getElementById('usuarioId').value;
    if (!confirm('Tem certeza que deseja deletar este usuário?')) return;
    
    try {
        const response = await fetch(`${API_URL}/admin/usuarios/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        
        if (!response.ok) throw new Error('Erro ao deletar usuário');
        
        alert('Usuário deletado com sucesso!');
        closeUsuarioModal();
        buscarUsuarios(currentPage);
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        alert('Erro ao deletar usuário');
    }
}

document.getElementById('usuarioForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('usuarioId').value;
    const novaSenha = document.getElementById('usuarioNovaSenha').value;
    
    const data = {
        nome: document.getElementById('usuarioNome').value,
        email: document.getElementById('usuarioEmail').value,
        telefone: document.getElementById('usuarioTelefone').value,
        plano: document.getElementById('usuarioPlano').value,
        data_expiracao_plano: document.getElementById('usuarioDataExpiracao').value || null
    };
    
    try {
        // Atualizar dados do usuário
        const response = await fetch(`${API_URL}/admin/usuarios/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error('Erro ao atualizar usuário');
        
        // Se houver nova senha, atualizar
        if (novaSenha) {
            const senhaResponse = await fetch(`${API_URL}/admin/usuarios/${id}/senha`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify({ novaSenha })
            });
            
            if (!senhaResponse.ok) throw new Error('Erro ao atualizar senha');
        }
        
        alert('Usuário atualizado com sucesso!');
        closeUsuarioModal();
        buscarUsuarios(currentPage);
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        alert('Erro ao atualizar usuário');
    }
});

// ============ PAGINAÇÃO ============

// Planos disponíveis para o modal de edição/dar plano
const PLANOS_DISPONIVEIS = [
    { nome: 'semanal', titulo: 'Semanal', dias: 7 },
    { nome: 'mensal', titulo: 'Mensal', dias: 30 },
    { nome: 'anual', titulo: 'Anual', dias: 365 },
    { nome: 'vitalicio', titulo: 'Vitalício', dias: 36500 }
];

// Função para dar plano manualmente
async function darPlanoManual() {
    const id = document.getElementById('usuarioId').value;
    const plano = document.getElementById('darPlanoNome').value;
    const dias = document.getElementById('darPlanoNome').options[document.getElementById('darPlanoNome').selectedIndex].getAttribute('data-dias');

    if (!confirm(`Tem certeza que deseja dar o plano ${plano.toUpperCase()} para este usuário?`)) return;

    try {
        const response = await fetch(`${API_URL}/admin/usuarios/${id}/dar-plano`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ plano, duracao_dias: parseInt(dias) })
        });

        if (!response.ok) throw new Error('Erro ao dar plano');

        alert('Plano ativado com sucesso!');
        closeUsuarioModal();
        buscarUsuarios(currentPage);
    } catch (error) {
        console.error('Erro ao dar plano:', error);
        alert('Erro ao dar plano');
    }
}

// Função para banir IP
async function banirIP(tipo) {
    const id = document.getElementById('usuarioId').value;
    let ip = '';
    let ipField = '';

    if (tipo === 'internet') {
        ip = document.getElementById('usuarioIpUltimoLogin').value;
        ipField = 'IP de Último Login';
    } else if (tipo === 'celular') {
        ip = document.getElementById('usuarioIpCadastro').value;
        ipField = 'IP de Cadastro';
    }

    if (ip === 'N/A' || !ip) {
        alert(`Não foi possível banir. ${ipField} não está registrado.`);
        return;
    }

    if (!confirm(`Tem certeza que deseja BANIR o IP ${ip} e desativar o plano do usuário?`)) return;

    try {
        const response = await fetch(`${API_URL}/admin/usuarios/${id}/banir`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ ip, tipo })
        });

        if (!response.ok) throw new Error('Erro ao banir IP');

        alert(`IP ${ip} banido e plano do usuário desativado com sucesso!`);
        closeUsuarioModal();
        buscarUsuarios(currentPage);
    } catch (error) {
        console.error('Erro ao banir IP:', error);
        alert('Erro ao banir IP');
    }
}

// Função para atualizar o valor da duração do plano no modal
function updateDarPlanoDias() {
    const select = document.getElementById('darPlanoNome');
    const selectedOption = select.options[select.selectedIndex];
    const dias = selectedOption.getAttribute('data-dias');
    document.getElementById('darPlanoDias').value = dias;
}

// Adicionar listener para atualizar a duração ao mudar o plano
document.addEventListener('DOMContentLoaded', () => {
    const darPlanoSelect = document.getElementById('darPlanoNome');
    if (darPlanoSelect) {
        darPlanoSelect.addEventListener('change', updateDarPlanoDias);
    }
});

// ============ PAGINAÇÃO ============

function renderPagination(elementId, currentPage, totalPages, callback) {
    const paginationDiv = document.getElementById(elementId);
    let html = '';
    
    // Botão anterior
    html += `<button ${currentPage === 1 ? 'disabled' : ''} onclick="${callback.name}(${currentPage - 1})">Anterior</button>`;
    
    // Páginas
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `<button class="${i === currentPage ? 'active' : ''}" onclick="${callback.name}(${i})">${i}</button>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += `<span>...</span>`;
        }
    }
    
    // Botão próximo
    html += `<button ${currentPage === totalPages ? 'disabled' : ''} onclick="${callback.name}(${currentPage + 1})">Próximo</button>`;
    
    paginationDiv.innerHTML = html;
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};
