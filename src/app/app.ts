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

  aluno: any = null;

  login(){

    if(this.matricula === "12345" && this.senha === "1234"){

      this.aluno = {
        nome: "João Silva",
        matricula: "12345",
        notas: [
          {nome:"Matemática", b1:8, b2:7.5, b3:9, b4:6, rec:7},
          {nome:"Português", b1:7, b2:6.5, b3:8, b4:7, rec:7.5},
          {nome:"História", b1:9, b2:8.5, b3:8, b4:9, rec:8},
          {nome:"Geografia", b1:8, b2:7, b3:7.5, b4:8, rec:7.5},
          {nome:"Ciências", b1:7, b2:6, b3:7, b4:8, rec:6.5}
        ]
      };

      this.logado = true;
      this.erro = "";

    } else {
      this.erro = "Matrícula ou senha inválidos.";
    }

  }

  logout(){
    this.logado = false;
    this.aluno = null;
    this.matricula = "";
    this.senha = "";
  }

}