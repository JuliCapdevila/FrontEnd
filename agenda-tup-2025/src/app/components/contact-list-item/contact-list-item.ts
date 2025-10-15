import { Component, Input, inject, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ContactsService } from '../../services/contacts-service';
import { Contact } from '../../interfaces/contacto';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact-list-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-list-item.html',
  styleUrls: ['./contact-list-item.scss']
})
export class ContactListItem {
  @Input() contacto!: Contact;
  @Input() index!: number;
  @Output() favoriteToggled = new EventEmitter<void>();

  private contactsService = inject(ContactsService);
  private router = inject(Router);

  get isFavorite(): boolean {
    return this.contacto.isFavorite;
  }

  verContacto() {
    this.router.navigate(['/contacts', this.contacto.id]);
  }

  editarContacto() {
    this.router.navigate(['/contacts', this.contacto.id, 'edit']);
  }

  async borrarContacto() {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      html: `¿Quieres eliminar a <strong>${this.contacto.firstName} ${this.contacto.lastName}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
        confirmButton: 'custom-swal-confirm',
        cancelButton: 'custom-swal-cancel'
      },
      background: 'white',
      buttonsStyling: true,
      reverseButtons: true
    });

    if (result.isConfirmed) {
      await this.contactsService.deleteContact(this.contacto.id);
      Swal.fire({
        title: '¡Eliminado!',
        text: `El contacto ${this.contacto.firstName} ${this.contacto.lastName} ha sido eliminado.`,
        icon: 'success',
        confirmButtonText: 'Ok',
        customClass: {
          popup: 'custom-swal-popup',
          title: 'custom-swal-title',
          confirmButton: 'swal-btn-ok' 
        },
        buttonsStyling: false,
        background: 'white'
      });
    }
  }

  async toggleFavorito() {
    this.contacto.isFavorite = !this.contacto.isFavorite;
    await this.contactsService.favorite(this.contacto.id);
    this.favoriteToggled.emit();
  }
}