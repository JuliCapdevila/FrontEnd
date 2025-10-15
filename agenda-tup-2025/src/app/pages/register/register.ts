import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; 
import { UsersService } from '../../services/users-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink], 
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterPage {
  isLoading = false;
  errorRegister = false;
  errorMessage = '';
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password2: ''
  };

  userService = inject(UsersService);
  router = inject(Router);

  async register(event: Event) {
    event.preventDefault();
    this.errorRegister = false;
    this.errorMessage = '';

 
    if (!this.formData.firstName || !this.formData.lastName || 
        !this.formData.email || !this.formData.password || 
        !this.formData.password2) {
      this.errorRegister = true;
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    if (this.formData.password !== this.formData.password2) {
      this.errorRegister = true;
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    if (this.formData.password.length < 4) {
      this.errorRegister = true;
      this.errorMessage = 'La contraseña debe tener al menos 4 caracteres.';
      return;
    }

  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.formData.email)) {
      this.errorRegister = true;
      this.errorMessage = 'Debe colocar un correo electrónico válido.';
      return;
    }

    this.isLoading = true;

    try {
      const ok = await this.userService.register({
        firstName: this.formData.firstName,
        lastName: this.formData.lastName,
        email: this.formData.email,
        password: this.formData.password,
      });

      this.isLoading = false;

      if (ok) {
        this.router.navigate(['/login']);
      } else {
        this.errorRegister = true;
        this.errorMessage = 'Error en el registro. El email ya existe o hay un problema con el servidor.';
      }
    } catch (error) {
      this.isLoading = false;
      this.errorRegister = true;
      this.errorMessage = 'Error de conexión. Intente nuevamente.';
    }
  }
}