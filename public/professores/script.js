window.onload = function() {
    let materia = localStorage.getItem("materia");
    if (!materia) { window.location.href = "/"; return; }
    
    let nomes = { 
        matematica: "📊 Matemática", portugues: "📖 Português", historia: "🏛️ História", geografia: "🌎 Geografia", ciencias: "🔬 Ciências", "9999": "🎓 Prof. Reginaldo"
    };
    if(document.getElementById("tituloMateria")) {
        document.getElementById("tituloMateria").innerText = nomes[materia] || "🎓 Área do Professor";
    }
};

function mostrar(secao) {
    document.getElementById("notas").classList.add("hidden");
    document.getElementById("gerenciar-alunos").classList.add("hidden");
    document.getElementById(secao).classList.remove("hidden");
}

// 🔍 Busca alunos para o Diário de Classe (Lançamento de Notas)
async function carregarAlunosDaTurma() {
    let turma = document.getElementById("turma").value;
    let container = document.getElementById("container-chamada");
    let tabela = document.getElementById("tabela-alunos-chamada");

    if (!turma) { container.classList.add("hidden"); return; }

    try {
        const response = await fetch(`http://localhost:3000/api/professor/alunos-turma/${encodeURIComponent(turma)}`);
        const data = await response.json();
        tabela.innerHTML = "";

        if (data.success && data.alunos.length > 0) {
            data.alunos.forEach(aluno => {
                tabela.innerHTML += `
                    <tr class="linha-aluno" data-matricula="${aluno.matricula}">
                        <td>${aluno.matricula}</td>
                        <td><strong>${aluno.nome}</strong></td>
                        <td><input type="number" class="input-nota" placeholder="0.0" min="0" max="10" step="0.1" style="width: 80px; text-align: center;"></td>
                        <td><input type="number" class="input-faltas" min="0" value="0" style="width: 80px; text-align: center;"></td>
                    </tr>`;
            });
            container.classList.remove("hidden");
        } else {
            tabela.innerHTML = `<tr><td colspan="4" style="text-align: center;">Nenhum aluno cadastrado nesta turma.</td></tr>`;
            container.classList.remove("hidden");
        }
    } catch (err) {
        console.error(err);
    }
}

// 💾 Salva as notas digitadas em lote
async function salvarDiarioCompleto() {
    let linhas = document.querySelectorAll(".linha-aluno");
    let materia = localStorage.getItem("materia");
    let bimestre = document.getElementById("bimestre").value;
    if (linhas.length === 0) return;

    for (let linha of linhas) {
        let matricula = linha.getAttribute("data-matricula");
        let nota = linha.querySelector(".input-nota").value;
        let faltas = linha.querySelector(".input-faltas").value;

        await fetch('http://localhost:3000/api/professor/salvar-diario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                matricula_aluno: matricula, materia: materia, bimestre: bimestre,
                nota: nota !== "" ? parseFloat(nota) : null, faltas: faltas !== "" ? parseInt(faltas) : 0
            })
        });
    }
    alert(`🎉 Diário de classe atualizado com sucesso para toda a turma!`);
}

// ➕ Cadastra Aluno pelo painel do Professor
async function cadastrarAluno() {
    let matricula = document.getElementById("novo-matricula").value;
    let nome = document.getElementById("novo-nome").value;
    let turma = document.getElementById("novo-turma").value;

    if (!matricula || !nome) { alert("Preencha matrícula e nome!"); return; }

    try {
        const response = await fetch('http://localhost:3000/api/professor/cadastrar-aluno', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ matricula, nome, turma })
        });
        const data = await response.json();

        if (data.success) {
            alert(data.message);
            document.getElementById("novo-matricula").value = "";
            document.getElementById("novo-nome").value = "";
            // Recarrega a tabela se o professor estiver visualizando a mesma turma inserida
            if(document.getElementById("filtro-turma-gerencia").value === turma) listarAlunosGerenciamento();
        } else {
            alert("Erro: " + data.message);
        }
    } catch (err) {
        alert("Erro na conexão.");
    }
}

// 📋 Lista os alunos na aba de gerenciamento
async function listarAlunosGerenciamento() {
    let turma = document.getElementById("filtro-turma-gerencia").value;
    let tabela = document.getElementById("tabela-gerenciar-alunos");
    if (!turma) { tabela.innerHTML = ""; return; }

    try {
        const response = await fetch(`http://localhost:3000/api/professor/alunos-turma/${encodeURIComponent(turma)}`);
        const data = await response.json();
        tabela.innerHTML = "";

        if (data.success && data.alunos.length > 0) {
            data.alunos.forEach(aluno => {
                tabela.innerHTML += `
                    <tr>
                        <td>${aluno.matricula}</td>
                        <td><strong>${aluno.nome}</strong></td>
                        <td><button onclick="removerAluno('${aluno.matricula}')" style="background-color:#e74c3c; color:white; border:none; padding:5px 10px; cursor:pointer; border-radius:4px;">❌ Remover</button></td>
                    </tr>`;
            });
        } else {
            tabela.innerHTML = `<tr><td colspan="3" style="text-align: center;">Nenhum aluno cadastrado.</td></tr>`;
        }
    } catch (err) {
        console.error(err);
    }
}

// 🗑️ Exclui o Aluno do banco
async function removerAluno(matricula) {
    if (!confirm(`Deseja realmente desmatricular o aluno com ID ${matricula}? Isso apagará suas notas também.`)) return;

    try {
        const response = await fetch(`http://localhost:3000/api/professor/remover-aluno/${matricula}`, { method: 'DELETE' });
        const data = await response.json();
        if (data.success) {
            alert(data.message);
            listarAlunosGerenciamento(); // Recarrega a lista
        }
    } catch (err) {
        alert("Erro ao excluir.");
    }
}

function logout() { localStorage.removeItem("materia"); window.location.href = "/"; }