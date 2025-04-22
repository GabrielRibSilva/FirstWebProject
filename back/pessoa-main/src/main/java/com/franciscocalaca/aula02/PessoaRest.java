package com.franciscocalaca.aula02;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.franciscocalaca.aula02.repository.PessoaRepository;

import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/pessoa")
public class PessoaRest {

    @Autowired
    private PessoaRepository pessoaRepository;

    @GetMapping
    public List<Pessoa> listar() {
        return pessoaRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> criar(@Valid @RequestBody Pessoa pessoa) {
        try {
            // Verifica se CPF já existe
            if (pessoa.getCpf() != null && pessoaRepository.findByCpf(pessoa.getCpf()).isPresent()) {
                return ResponseEntity.badRequest().body("CPF já cadastrado");
            }
            
            // Verifica se email já existe
            if (pessoa.getEmail() != null && pessoaRepository.findByEmail(pessoa.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email já cadastrado");
            }
            
            // Remove o ID para garantir que será um novo registro
            pessoa.setId(null);
            
            // Salva a pessoa no banco
            Pessoa pessoaSalva = pessoaRepository.save(pessoa);
            return ResponseEntity.status(HttpStatus.CREATED).body(pessoaSalva);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao criar pessoa: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody Pessoa novaPessoa) {
        try {
            return pessoaRepository.findById(id)
                .map(pessoaExistente -> {
                    // Verifica se CPF já existe para outra pessoa
                    if (novaPessoa.getCpf() != null) {
                        pessoaRepository.findByCpf(novaPessoa.getCpf())
                            .ifPresent(p -> {
                                if (!p.getId().equals(id)) {
                                    throw new RuntimeException("CPF já cadastrado para outra pessoa");
                                }
                            });
                    }
                    
                    // Verifica se email já existe para outra pessoa
                    if (novaPessoa.getEmail() != null) {
                        pessoaRepository.findByEmail(novaPessoa.getEmail())
                            .ifPresent(p -> {
                                if (!p.getId().equals(id)) {
                                    throw new RuntimeException("Email já cadastrado para outra pessoa");
                                }
                            });
                    }
                    
                    // Atualiza os dados
                    novaPessoa.setId(id);
                    Pessoa pessoaAtualizada = pessoaRepository.save(novaPessoa);
                    return ResponseEntity.ok(pessoaAtualizada);
                })
                .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao atualizar pessoa: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            return pessoaRepository.findById(id)
                .map(pessoa -> {
                    pessoaRepository.deleteById(id);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao deletar pessoa: " + e.getMessage());
        }
    }
}