import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser'
import { Usuario } from '../models/Usuario'
import { SupabaseService } from '../services/supabase.service'

@Component({
  selector: 'app-foto',
  templateUrl: './foto-perfil.component.html',
  styleUrls: ['./foto-perfil.component.scss'],
})
export class FotoPerfilComponent implements OnInit {
  _avatarUrl: SafeResourceUrl | undefined
  uploading = false

  @Input()
  set avatarUrl(url: string | null) {
    if (url) {
      this.downloadImage(url)
    }
  }

  @Input()
  datos!:Usuario;

  @Output() upload = new EventEmitter<string>()

  constructor(private readonly supabase: SupabaseService, private readonly dom: DomSanitizer) {}

  ngOnInit(): void {
    
    this.downloadImage(this.datos.imgurl)
  }

  async downloadImage(path: string) {
    try {
      const { data } = await this.supabase.downLoadImage(path,this.datos.codusu)
      if (data instanceof Blob) {
        this._avatarUrl = this.dom.bypassSecurityTrustResourceUrl(URL.createObjectURL(data))
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error downloading image: ', error.message)
      }
    }
  }

  async uploadAvatar(event: any) {
    try {
      this.uploading = true
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${Math.random()}.${fileExt}`

      await this.supabase.uploadAvatar(filePath, file, this.datos.codusu)
      this.datos.imgurl=filePath;
      this.supabase.guardarTodo(this.datos,this.datos.codusu)
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      this.uploading = false
    }
  }
}