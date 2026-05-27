import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  matricula = "";
  senha = "";
  logado = false;
  erro = "";

  tipoUsuario = ""; // Salva se quem entrou é 'aluno' ou 'professor'
  aluno: any = null;
  professor: any = null;

  async login() {
    this.erro = ""; 

    if (!this.matricula || !this.senha) {
      this.erro = "Por favor, preencha a matrícula e a senha.";
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/login-aluno', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          matricula: this.matricula,
          senha: this.senha
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        this.logado = true;
        this.tipoUsuario = data.tipo; // Recebe 'aluno' ou 'professor' do node

        if (data.tipo === 'aluno') {
          this.aluno = data.dados;
        } else if (data.tipo === 'professor') {
          // Salva os dados para o script.js ler e redireciona para a pasta pública
          localStorage.setItem('professor_logado', JSON.stringify(data.dados));
          localStorage.setItem('materia', data.dados.registro); // Alinha com o seu script.js
          window.location.href = '/professores/dashboard.html';
        }
      } else {
        this.erro = data.message || "Matrícula ou senha inválidos.";
      }

    } catch (err) {
      console.error("Erro ao conectar na API:", err);
      this.erro = "Não foi possível conectar ao servidor. Verifique sua conexão.";
    }
  } // 👈 Aqui fecha estritamente a função login()

  logout() {
    this.logado = false;
    this.tipoUsuario = "";
    this.aluno = null;
    this.professor = null;
    this.matricula = "";
    this.senha = "";
    this.erro = "";
  } // 👈 Aqui fecha estritamente a função logout()

} // 👈 Aqui fecha estritamente a classe App de forma limpa!