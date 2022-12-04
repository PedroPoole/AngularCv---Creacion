import { Component } from '@angular/core'
import { SupabaseService } from '../services/supabase.service'

@Component({
  selector: 'app-auth',
  template: `
    <div class="row flex-center flex">
      <form class="login-form">
        <h1 class="header">Login del creador de CVs</h1>
        <div>
          <input
            #input
            class="inputField"
            type="email"
            placeholder="Your email"
            class="form-control-material"
          />
        </div>
        <div>
          <button
            type="submit"
            (click)="handleLogin(input.value)"
            class="btn btn-outline-primary btn-ghost"
            [disabled]="loading"
          >
            {{ loading ? 'Loading' : 'Enviar link mágico' }}
          </button>
        </div>
      </form>
    </div>
  `,
   styleUrls: ['./pag-login.component.scss']
})
export class PagLoginComponent {
  loading = false

  constructor(private readonly supabase: SupabaseService) {}

  async handleLogin(input: string) {
    try {
      this.loading = true
      await this.supabase.signIn(input)
      alert('Check your email for the login link!')
    } catch (error:any) {
      alert(error.error_description || error.message)
    } finally {
      this.loading = false
    }
  }
}