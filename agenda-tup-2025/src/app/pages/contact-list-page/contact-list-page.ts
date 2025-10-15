import { Component, inject, OnInit } from '@angular/core';
import { ContactsService } from '../../services/contacts-service';
import { Contact } from '../../interfaces/contacto';
import { RouterLink } from '@angular/router';
import { ContactListItem } from "../../components/contact-list-item/contact-list-item";

@Component({
  selector: 'app-contact-list-page',
  standalone: true,
  templateUrl: './contact-list-page.html',
  styleUrls: ['./contact-list-page.scss'],
  imports: [RouterLink, ContactListItem]
})
export class ContactListPage implements OnInit {
  contactsService = inject(ContactsService);
  filteredContacts: Contact[] = [];

  async ngOnInit() {
    await this.loadContacts();
    this.contactsService.contactsChanged.subscribe(() => {
      this.filteredContacts = [...this.contactsService.contacts];
    });
  }

  async loadContacts() {
    try {
      await this.contactsService.getContacts();
      this.filteredContacts = [...this.contactsService.contacts];
      console.log(this.filteredContacts);
    } catch (error) {
      console.error('Error al cargar los contactos:', error);
      this.filteredContacts = [];
    }
  }

  onSearch(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase().trim();

    if (!searchTerm) {
      this.filteredContacts = [...this.contactsService.contacts];
      return;
    }

    this.filteredContacts = this.contactsService.contacts.filter(contact =>
      contact.firstName?.toLowerCase().includes(searchTerm) ||
      contact.lastName?.toLowerCase().includes(searchTerm) ||
      contact.number?.toString().includes(searchTerm) ||
      contact.email?.toLowerCase().includes(searchTerm)
    );
  }
  onFavoriteToggled() {
    this.filteredContacts = [...this.filteredContacts];
  }
}
