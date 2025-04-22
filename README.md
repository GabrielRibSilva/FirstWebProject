# Sistema de Cadastro de Pessoas

Um sistema de cadastro com validação avançada desenvolvido em Angular e Spring Boot.

## Funcionalidades

- Cadastro completo de pessoas com validação em tempo real
- Validação personalizada de CPF com verificação de dígitos
- Validação de email com suporte a códigos de país internacionais (BR, US, etc.)
- Formatação automática de telefone e CPF durante digitação
- Operações CRUD completas (Criar, Ler, Atualizar, Deletar)
- Interface responsiva e amigável ao usuário

## Validações Implementadas

### Frontend (Angular)
- **Nome**: Apenas letras, espaços, apóstrofos e hífens
- **CPF**: Formato correto e algoritmo de validação de dígitos verificadores
- **Email**: Formato padrão e validação de códigos de país específicos
- **Telefone**: Formatação automática e validação de comprimento

### Backend (Spring Boot)
- Validação com Hibernate Validator
- Anotação personalizada @CPF para validação de CPF
- Classes de validação customizadas (CPFValidator)
- Padrões de Regex avançados para validação de email e telefone
- Tratamento de exceções para erros de validação

## Estrutura do Backend

- **Pessoa.java**: Entidade principal com anotações de validação
- **PessoaRepository.java**: Interface de acesso ao banco de dados
- **PessoaRest.java**: Controlador REST com endpoints de CRUD
- **validation/CPF.java**: Anotação customizada para validação de CPF
- **validation/CPFValidator.java**: Implementação da validação de CPF

## Tecnologias Utilizadas

### Frontend
- Angular
- TypeScript
- HTML/CSS
- Reactive Forms

### Backend
- Spring Boot
- Hibernate Validator
- JPA/Hibernate
- H2 Database (para desenvolvimento)

## Como Executar

### Backend
1. Clone o repositório
2. Execute `mvn clean install` para build do projeto
3. Execute `mvn spring-boot:run` para iniciar o servidor

### Frontend
1. Navegue até a pasta do frontend
2. Execute `npm install` para instalar as dependências
3. Execute `ng serve` para iniciar o servidor de desenvolvimento
4. Acesse `http://localhost:4200/` no navegador

## Créditos

Desenvolvido como parte do projeto de validação de formulários com Angular e Spring Boot.
