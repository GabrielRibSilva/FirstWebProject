import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PessoaService {
  private apiUrl = 'http://localhost:8080/pessoa';

  constructor(private http: HttpClient) {}

  get() {
    return this.http.get<any[]>(this.apiUrl);
  }

  salvarPessoa(pessoa: any) {
    return this.http.post<any>(this.apiUrl, pessoa);
  }

  atualizarPessoa(pessoa: any) {
    return this.http.put<any>(`${this.apiUrl}/${pessoa.id}`, pessoa);
  }

  deletarPessoa(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}