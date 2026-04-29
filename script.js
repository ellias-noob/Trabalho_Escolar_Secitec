function login() {
    let user = document.getElementById("user").value.toLowerCase();
    let pass = document.getElementById("pass").value;
    const professores = { matematica: "1234", portugues: "1234", historia: "1234", geografia: "1234", ciencias: "1234" };

    if (professores[user] && professores[user] === pass) {
        localStorage.setItem("materia", user);
        window.location.href = "dashboard.html";
    } else { alert("Login inválido!"); }
}

window.onload = function() {
    let materia = localStorage.getItem("materia");
    if (!materia) { window.location.href = "login.html"; return; }
    let nomes = { matematica: "📊 Matemática", portugues: "📖 Português", historia: "🏛️ História", geografia: "🌎 Geografia", ciencias: "🔬 Ciências" };
    if(document.getElementById("tituloMateria")) document.getElementById("tituloMateria").innerText = nomes[materia];
    atualizarTabela();
};

function mostrar(secao) {
    document.getElementById("notas").classList.add("hidden");
    document.getElementById("lista").classList.add("hidden");
    document.getElementById(secao).classList.remove("hidden");
}

function addNota() {
    let nome = document.getElementById("nome").value;
    let nota = document.getElementById("nota").value;
    let bim = document.getElementById("bimestre").value;
    let turma = document.getElementById("turma").value;
    let materia = localStorage.getItem("materia");

    if(!nome || !nota || !turma) { alert("Preencha tudo!"); return; }

    let notas = JSON.parse(localStorage.getItem(materia)) || [];
    notas.push({ aluno: nome, bimestre: bim, nota: nota, turma: turma });
    localStorage.setItem(materia, JSON.stringify(notas));
    atualizarTabela();
    
    document.getElementById("nome").value = "";
    document.getElementById("nota").value = "";
    document.getElementById("turma").value = "";
    alert("Nota salva com sucesso!");
}

function atualizarTabela() {
    let materia = localStorage.getItem("materia");
    let notas = JSON.parse(localStorage.getItem(materia)) || [];
    let tabela = document.getElementById("tabela");
    if(!tabela) return;
    tabela.innerHTML = "";
    notas.forEach((n, i) => {
        tabela.innerHTML += `<tr><td>${n.aluno}</td><td>${n.turma}</td><td>${n.bimestre}</td><td>${n.nota}</td><td><button onclick="removerNota(${i})">❌</button></td></tr>`;
    });
}

function removerNota(index) {
    let materia = localStorage.getItem("materia");
    let notas = JSON.parse(localStorage.getItem(materia)) || [];
    notas.splice(index, 1);
    localStorage.setItem(materia, JSON.stringify(notas));
    atualizarTabela();
}

function logout() { localStorage.removeItem("materia"); window.location.href = "login.html"; }