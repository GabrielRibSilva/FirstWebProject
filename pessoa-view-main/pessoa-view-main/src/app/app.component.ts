import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PessoaService } from './pessoa.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'aula01-view';
  formulario!: FormGroup;
  pessoas: Array<{ id: number; nome: string; cpf: string; email: string; telefone: string }> = [];
  mostrarPopup = false;
  pessoaEmEdicao: any = null;
  
  // Códigos de país válidos
  codigosPaisValidos = ['AP', 'AR', 'AT', 'AU', 'BA', 'BE', 'BG', 'BR', 'CA', 'CH', 'CN', 'CU', 'CY', 'CZ', 'DE', 'DK', 'DZ', 'EA', 'EE', 'EG', 'EP', 'ES', 'FI', 'FR', 'GB', 'GR', 'HK', 'HR', 'HU', 'IE', 'IL', 'IN', 'IT', 'JP', 'KE', 'KR', 'LT', 'LU', 'LV', 'MC', 'MD', 'MN', 'MT', 'MW', 'MX', 'MY', 'NC', 'NL', 'NO', 'NZ', 'OA', 'PH', 'PL', 'PT', 'RO', 'RU', 'SE', 'SG', 'SI', 'SK', 'SU', 'TJ', 'TR', 'TT', 'TW', 'US', 'VN', 'WO', 'YU', 'ZA', 'ZM', 'ZW'];
  
  // Variáveis para controle de erros no popup
  erroNome = false;
  erroNomeTipo = '';
  erroCPF = false;
  erroCPFTipo = '';
  erroEmail = false;
  erroEmailTipo = '';
  erroTelefone = false;
  erroTelefoneTipo = '';
  temErros = false;

  constructor(
    private pessoaService: PessoaService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.inicializarFormulario();
    this.listar();
  }

  inicializarFormulario() {
    this.formulario = this.fb.group({
      id: [undefined],
      nome: ['', [
        Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(100),
        Validators.pattern('^[a-zA-ZÀ-ÖØ-öø-ÿ\\s\'-]+$')
      ]],
      cpf: ['', [
        Validators.required, 
        Validators.maxLength(14), // Limite para o CPF com formatação (000.000.000-00)
        this.validarCPF()
      ]],
      email: ['', [
        Validators.required, 
        Validators.maxLength(60),
        this.validarEmail()
      ]],
      telefone: ['', [
        Validators.required, 
        Validators.maxLength(15), // Limite para telefone com formatação ((00) 00000-0000)
        Validators.pattern('^[0-9()\\s-]{10,15}$'),
        this.validarTelefone()
      ]]
    });
  }

  // Event handlers para prevenir entrada de caracteres inválidos
  validarEntradaNome(event: any) {
    // Permite apenas letras, espaços e alguns caracteres especiais (para nomes compostos/acentuados)
    const pattern = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]$/;
    const inputChar = String.fromCharCode(event.charCode);
    
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  // Validação para colar texto no nome
  validarColaNome(event: any) {
    setTimeout(() => {
      const value = event.target.value;
      // Remove caracteres não permitidos
      const valorLimpo = value.replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ\s'-]/g, '');
      // Atualiza o valor no formulário
      this.formulario.get('nome')?.setValue(valorLimpo);
    }, 0);
  }

  validarEntradaCPF(event: any) {
    // Permite apenas números e alguns caracteres de formatação
    const pattern = /^[0-9.-]$/;
    const inputChar = String.fromCharCode(event.charCode);
    
    // Limitar o tamanho máximo do CPF
    const cpfAtual = event.target.value || '';
    if (cpfAtual.replace(/[^\d]/g, '').length >= 11 && event.charCode !== 0) {
      event.preventDefault();
      return;
    }
    
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  // Validação para colar texto no CPF
  validarColaCPF(event: any) {
    setTimeout(() => {
      const value = event.target.value;
      // Remove caracteres não permitidos e limita a 11 dígitos
      const numerosCPF = value.replace(/[^\d]/g, '').substring(0, 11);
      
      // Formata o CPF
      let cpfFormatado = numerosCPF;
      if (numerosCPF.length > 3) {
        cpfFormatado = numerosCPF.substring(0, 3) + '.' + numerosCPF.substring(3);
      }
      if (numerosCPF.length > 6) {
        cpfFormatado = cpfFormatado.substring(0, 7) + '.' + cpfFormatado.substring(7);
      }
      if (numerosCPF.length > 9) {
        cpfFormatado = cpfFormatado.substring(0, 11) + '-' + cpfFormatado.substring(11);
      }
      
      // Atualiza o valor no formulário
      this.formulario.get('cpf')?.setValue(cpfFormatado);
    }, 0);
  }

  validarEntradaTelefone(event: any) {
    // Permite apenas números e alguns caracteres de formatação
    const pattern = /^[0-9()-\s]$/;
    const inputChar = String.fromCharCode(event.charCode);
    
    // Limitar o tamanho máximo do telefone
    const telefoneAtual = event.target.value || '';
    if (telefoneAtual.replace(/[^\d]/g, '').length >= 11 && event.charCode !== 0) {
      event.preventDefault();
      return;
    }
    
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  
  // Validação para colar texto no telefone
  validarColaTelefone(event: any) {
    setTimeout(() => {
      const value = event.target.value;
      // Remove caracteres não permitidos e limita a 11 dígitos
      const numerosTelefone = value.replace(/[^\d]/g, '').substring(0, 11);
      
      // Formata o telefone
      let telefoneFormatado = numerosTelefone;
      if (numerosTelefone.length > 0) {
        telefoneFormatado = '(' + numerosTelefone.substring(0, 2);
      }
      if (numerosTelefone.length > 2) {
        telefoneFormatado = telefoneFormatado + ') ' + numerosTelefone.substring(2);
      }
      if (numerosTelefone.length > 7) {
        telefoneFormatado = telefoneFormatado.substring(0, 10) + '-' + telefoneFormatado.substring(10);
      }
      
      // Atualiza o valor no formulário
      this.formulario.get('telefone')?.setValue(telefoneFormatado);
    }, 0);
  }
  
  // Validação para colar texto no email
  validarColaEmail(event: any) {
    setTimeout(() => {
      const value = event.target.value;
      // Limita o comprimento a 60 caracteres
      const emailLimitado = value.substring(0, 60);
      
      // Atualiza o valor no formulário
      this.formulario.get('email')?.setValue(emailLimitado);
    }, 0);
  }

  // Validador personalizado para CPF
  validarCPF() {
    return (control: any) => {
      const cpf = control.value?.replace(/[^\d]/g, '');
      
      if (!cpf) {
        return null; // Deixa o Validators.required cuidar disso
      }

      if (cpf.length !== 11) {
        return { cpfTamanhoInvalido: true };
      }

      // Verifica se todos os dígitos são iguais
      if (/^(\d)\1{10}$/.test(cpf)) {
        return { cpfDigitosIguais: true };
      }

      // Validação do primeiro dígito verificador
      let soma = 0;
      for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
      }
      let resto = 11 - (soma % 11);
      let digitoVerificador1 = resto === 10 || resto === 11 ? 0 : resto;
      
      if (digitoVerificador1 !== parseInt(cpf.charAt(9))) {
        return { cpfDigitoVerificador: true };
      }

      // Validação do segundo dígito verificador
      soma = 0;
      for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
      }
      resto = 11 - (soma % 11);
      let digitoVerificador2 = resto === 10 || resto === 11 ? 0 : resto;
      
      if (digitoVerificador2 !== parseInt(cpf.charAt(10))) {
        return { cpfDigitoVerificador: true };
      }

      return null;
    };
  }

  // Validador personalizado para email
  validarEmail() {
    return (control: any) => {
      const email = control.value;
      
      if (!email) {
        return null; // Deixa o Validators.required cuidar disso
      }
      
      // Expressão regular básica para verificar o formato do email
      const emailBasicoPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
      
      // Verifica primeiro se o email básico é válido
      if (!emailBasicoPattern.test(email)) {
        return { emailFormatoInvalido: true };
      }
      
      // Verifica se há um código de país no email
      const parts = email.split('.');
      if (parts.length > 2) {
        // Obtém o último segmento (possível código de país)
        const possivelCodigoPais = parts[parts.length - 1].toUpperCase();
        
        // Verifica se tem mais de 2 letras
        if (possivelCodigoPais.length !== 2) {
          return { emailCodigoTamanhoInvalido: true };
        }
        
        // Verifica se é um código de país válido
        if (!this.codigosPaisValidos.includes(possivelCodigoPais)) {
          return { emailCodigoPaisInvalido: true };
        }
      }
      
      return null;
    };
  }

  // Validador personalizado para telefone
  validarTelefone() {
    return (control: any) => {
      const telefone = control.value?.replace(/[^\d]/g, '');
      
      if (!telefone) {
        return null; // Deixa o Validators.required cuidar disso
      }
      
      if (telefone.length !== 10 && telefone.length !== 11) {
        return { telefoneTamanhoInvalido: true };
      }
      
      return null;
    };
  }

  get f() {
    return this.formulario.controls;
  }

  listar() {
    this.pessoaService.get().subscribe({
      next: (response) => {
        this.pessoas = response;
      },
      error: (response) => {
        console.error('Erro ao listar pessoas', response);
      }
    });
  }

  salvar() {
    if (this.formulario.invalid) {
      // Marca todos os campos como touched para mostrar os erros
      Object.keys(this.formulario.controls).forEach(campo => {
        const controle = this.formulario.get(campo);
        controle?.markAsTouched();
      });
      return;
    }

    const pessoa = this.formulario.value;

    if (pessoa.id) {
      // Atualizar
      this.pessoaService.atualizarPessoa(pessoa).subscribe({
        next: () => {
          console.log('Atualizado com sucesso');
          this.listar();
          this.resetarFormulario();
        },
        error: () => {
          console.log('Erro ao atualizar');
        }
      });
    } else {
      // Criar novo
      this.pessoaService.salvarPessoa(pessoa).subscribe({
        next: () => {
          console.log('Salvo com sucesso');
          this.listar();
          this.resetarFormulario();
        },
        error: () => {
          console.log('Erro ao salvar');
        }
      });
    }
  }

  carregarParaEdicao(pessoa: any) {
    this.pessoaEmEdicao = { ...pessoa };
    this.mostrarPopup = true;
    // Reinicia os erros
    this.reiniciarErros();
    // Verifica se há erros iniciais
    this.verificarErros();
  }

  fecharPopup() {
    this.mostrarPopup = false;
    this.pessoaEmEdicao = null;
    this.reiniciarErros();
  }
  
  reiniciarErros() {
    this.erroNome = false;
    this.erroNomeTipo = '';
    this.erroCPF = false;
    this.erroCPFTipo = '';
    this.erroEmail = false;
    this.erroEmailTipo = '';
    this.erroTelefone = false;
    this.erroTelefoneTipo = '';
    this.temErros = false;
  }
  
  verificarErros() {
    if (!this.pessoaEmEdicao) return;
    
    // Validação do nome
    if (!this.pessoaEmEdicao.nome || this.pessoaEmEdicao.nome.trim() === '') {
      this.erroNome = true;
      this.erroNomeTipo = 'required';
    } else if (this.pessoaEmEdicao.nome.length < 3) {
      this.erroNome = true;
      this.erroNomeTipo = 'minlength';
    } else if (this.pessoaEmEdicao.nome.length > 100) {
      this.erroNome = true;
      this.erroNomeTipo = 'maxlength';
    } else if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/.test(this.pessoaEmEdicao.nome)) {
      this.erroNome = true;
      this.erroNomeTipo = 'pattern';
    } else {
      this.erroNome = false;
      this.erroNomeTipo = '';
    }
    
    // Validação do CPF
    const cpf = this.pessoaEmEdicao.cpf?.replace(/[^\d]/g, '');
    if (!cpf || cpf.trim() === '') {
      this.erroCPF = true;
      this.erroCPFTipo = 'required';
    } else if (cpf.length !== 11) {
      this.erroCPF = true;
      this.erroCPFTipo = 'tamanho';
    } else if (/^(\d)\1{10}$/.test(cpf)) {
      this.erroCPF = true;
      this.erroCPFTipo = 'digitosIguais';
    } else {
      // Validação dos dígitos verificadores
      let soma = 0;
      for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
      }
      let resto = 11 - (soma % 11);
      let dv1 = resto === 10 || resto === 11 ? 0 : resto;
      
      soma = 0;
      for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
      }
      resto = 11 - (soma % 11);
      let dv2 = resto === 10 || resto === 11 ? 0 : resto;
      
      if (dv1 !== parseInt(cpf.charAt(9)) || dv2 !== parseInt(cpf.charAt(10))) {
        this.erroCPF = true;
        this.erroCPFTipo = 'digitoVerificador';
      } else {
        this.erroCPF = false;
        this.erroCPFTipo = '';
      }
    }
    
    // Validação do email
    const emailBasicoPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!this.pessoaEmEdicao.email || this.pessoaEmEdicao.email.trim() === '') {
      this.erroEmail = true;
      this.erroEmailTipo = 'required';
    } else if (!emailBasicoPattern.test(this.pessoaEmEdicao.email)) {
      this.erroEmail = true;
      this.erroEmailTipo = 'formato';
    } else if (this.pessoaEmEdicao.email.length > 60) {
      this.erroEmail = true;
      this.erroEmailTipo = 'maxlength';
    } else {
      // Verificação do código de país, se existir
      const parts = this.pessoaEmEdicao.email.split('.');
      if (parts.length > 2) {
        const possivelCodigoPais = parts[parts.length - 1].toUpperCase();
        
        // Verifica se tem exatamente 2 letras
        if (possivelCodigoPais.length !== 2) {
          this.erroEmail = true;
          this.erroEmailTipo = 'tamanhocodigopais';
        }
        // Verifica se é um código de país válido
        else if (!this.codigosPaisValidos.includes(possivelCodigoPais)) {
          this.erroEmail = true;
          this.erroEmailTipo = 'codigopais';
        } else {
          this.erroEmail = false;
          this.erroEmailTipo = '';
        }
      } else {
        this.erroEmail = false;
        this.erroEmailTipo = '';
      }
    }
    
    // Validação do telefone
    const telefone = this.pessoaEmEdicao.telefone?.replace(/[^\d]/g, '');
    if (!telefone || telefone.trim() === '') {
      this.erroTelefone = true;
      this.erroTelefoneTipo = 'required';
    } else if (telefone.length !== 10 && telefone.length !== 11) {
      this.erroTelefone = true;
      this.erroTelefoneTipo = 'tamanho';
    } else if (!/^[0-9()\s-]{10,15}$/.test(this.pessoaEmEdicao.telefone)) {
      this.erroTelefone = true;
      this.erroTelefoneTipo = 'pattern';
    } else if (this.pessoaEmEdicao.telefone.length > 15) {
      this.erroTelefone = true;
      this.erroTelefoneTipo = 'maxlength';
    } else {
      this.erroTelefone = false;
      this.erroTelefoneTipo = '';
    }
    
    // Verifica se tem algum erro
    this.temErros = this.erroNome || this.erroCPF || this.erroEmail || this.erroTelefone;
  }

  salvarEdicao() {
    if (!this.pessoaEmEdicao) return;
    
    // Verifica erros antes de salvar
    this.verificarErros();
    
    // Se houver erros, não prossegue
    if (this.temErros) {
      return;
    }
    
    this.pessoaService.atualizarPessoa(this.pessoaEmEdicao).subscribe({
      next: () => {
        console.log('Atualizado com sucesso');
        this.listar();
        this.fecharPopup();
      },
      error: () => {
        console.log('Erro ao atualizar');
      }
    });
  }
  
  // Validadores para o popup
  validarNomePopup(event: any) {
    const pattern = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]$/;
    const inputChar = String.fromCharCode(event.charCode);
    
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  
  validarColaNomePopup(event: any) {
    setTimeout(() => {
      // Remove caracteres não permitidos
      const valorLimpo = this.pessoaEmEdicao.nome.replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ\s'-]/g, '');
      this.pessoaEmEdicao.nome = valorLimpo;
    }, 0);
  }
  
  validarCPFPopup(event: any) {
    const pattern = /^[0-9.-]$/;
    const inputChar = String.fromCharCode(event.charCode);
    
    const cpfAtual = this.pessoaEmEdicao.cpf || '';
    if (cpfAtual.replace(/[^\d]/g, '').length >= 11 && event.charCode !== 0) {
      event.preventDefault();
      return;
    }
    
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  
  validarColaCPFPopup(event: any) {
    setTimeout(() => {
      const value = this.pessoaEmEdicao.cpf;
      // Remove caracteres não permitidos e limita a 11 dígitos
      const numerosCPF = value.replace(/[^\d]/g, '').substring(0, 11);
      
      // Formata o CPF
      let cpfFormatado = numerosCPF;
      if (numerosCPF.length > 3) {
        cpfFormatado = numerosCPF.substring(0, 3) + '.' + numerosCPF.substring(3);
      }
      if (numerosCPF.length > 6) {
        cpfFormatado = cpfFormatado.substring(0, 7) + '.' + cpfFormatado.substring(7);
      }
      if (numerosCPF.length > 9) {
        cpfFormatado = cpfFormatado.substring(0, 11) + '-' + cpfFormatado.substring(11);
      }
      
      this.pessoaEmEdicao.cpf = cpfFormatado;
    }, 0);
  }
  
  validarTelefonePopup(event: any) {
    const pattern = /^[0-9()-\s]$/;
    const inputChar = String.fromCharCode(event.charCode);
    
    const telefoneAtual = this.pessoaEmEdicao.telefone || '';
    if (telefoneAtual.replace(/[^\d]/g, '').length >= 11 && event.charCode !== 0) {
      event.preventDefault();
      return;
    }
    
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  
  validarColaTelefonePopup(event: any) {
    setTimeout(() => {
      const value = this.pessoaEmEdicao.telefone;
      // Remove caracteres não permitidos e limita a 11 dígitos
      const numerosTelefone = value.replace(/[^\d]/g, '').substring(0, 11);
      
      // Formata o telefone
      let telefoneFormatado = numerosTelefone;
      if (numerosTelefone.length > 0) {
        telefoneFormatado = '(' + numerosTelefone.substring(0, 2);
      }
      if (numerosTelefone.length > 2) {
        telefoneFormatado = telefoneFormatado + ') ' + numerosTelefone.substring(2);
      }
      if (numerosTelefone.length > 7) {
        telefoneFormatado = telefoneFormatado.substring(0, 10) + '-' + telefoneFormatado.substring(10);
      }
      
      this.pessoaEmEdicao.telefone = telefoneFormatado;
    }, 0);
  }
  
  validarColaEmailPopup(event: any) {
    setTimeout(() => {
      // Limita o comprimento a 60 caracteres
      this.pessoaEmEdicao.email = this.pessoaEmEdicao.email.substring(0, 60);
    }, 0);
  }

  excluir(id: number) {
    this.pessoaService.deletarPessoa(id).subscribe({
      next: () => {
        console.log('Excluído com sucesso');
        this.listar();
      },
      error: () => {
        console.log('Erro ao excluir');
      }
    });
  }

  resetarFormulario() {
    this.formulario.reset();
    this.inicializarFormulario();
  }
}