import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ContactsService } from '../../services/contacts-service';
import { Contact } from '../../interfaces/contacto';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-contact-details-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './contact-details-page.html',
  styleUrls: ['./contact-details-page.scss']
})
export class ContactDetailsPage implements OnInit {
  private contactsService = inject(ContactsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(Auth);

  contacto: Contact | null = null;
  isLoading = true;
  error = false;

  async ngOnInit() {
    const contactId = this.route.snapshot.paramMap.get('id');

    if (contactId) {
      try {
        this.contacto = await this.contactsService.getContactById(contactId);

        if (!this.contacto) {
          this.error = true;
        }
      } catch (err) {
        this.error = true;
        console.error('Error cargando contacto:', err);
      } finally {
        this.isLoading = false;
      }
    } else {
      this.isLoading = false;
      this.error = true;
    }
  }

  editarContacto() {
    if (this.contacto) {
      this.router.navigate(['/contacts', this.contacto.id, 'edit']);
    }
  }

  volverALista() {
    this.router.navigate(['/']);
  }
}