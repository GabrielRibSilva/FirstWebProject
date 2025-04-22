package com.franciscocalaca.aula02;

import com.franciscocalaca.aula02.validation.CPF;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
public class Pessoa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "O nome não pode ficar em branco")
    @Size(min = 3, max = 100, message = "O nome deve conter entre 3 e 100 caracteres")
    @Pattern(regexp = "^[a-zA-ZÀ-ÖØ-öø-ÿ\\s'-]+$", 
             message = "O nome deve conter apenas letras, espaços, apóstrofos e hífens")
    private String nome;
    
    @NotBlank(message = "O CPF é um campo obrigatório")
    @CPF(message = "O CPF informado não é válido. Verifique os dígitos e tente novamente")
    private String cpf;
    
    @NotBlank(message = "O email não pode ficar em branco")
    @Pattern(regexp = "^[\\w._%+-]+@[\\w.-]+\\.[a-zA-Z]{2,}(\\.(?:AP|AR|AT|AU|BA|BE|BG|BR|CA|CH|CN|CU|CY|CZ|DE|DK|DZ|EA|EE|EG|EP|ES|FI|FR|GB|GR|HK|HR|HU|IE|IL|IN|IT|JP|KE|KR|LT|LU|LV|MC|MD|MN|MT|MW|MX|MY|NC|NL|NO|NZ|OA|PH|PL|PT|RO|RU|SE|SG|SI|SK|SU|TJ|TR|TT|TW|US|VN|WO|YU|ZA|ZM|ZW))?$", 
             message = "Formato de email inválido. Exemplo correto: usuario@dominio.com ou usuario@dominio.com.BR")
    @Size(max = 60, message = "O email não pode exceder 60 caracteres")
    private String email;
    
    @NotBlank(message = "O telefone é um campo obrigatório")
    @Pattern(regexp = "^[0-9()\\s-]{10,15}$", 
             message = "Formato de telefone inválido. Use apenas números, parênteses, espaços e hífens (10-15 caracteres)")
    private String telefone;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }
}