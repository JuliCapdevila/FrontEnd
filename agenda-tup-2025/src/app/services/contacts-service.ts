import { inject, Injectable } from '@angular/core';
import { Contact, NewContact } from '../interfaces/contacto';
import { Auth } from './auth';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  favorite(id: number) {
    throw new Error('Method not implemented.');
  }
  authService = inject(Auth);
  readonly URL_BASE = "https://agenda-api.somee.com/api/contacts";

  contacts: Contact[] = [];
  contactsChanged = new Subject<void>();

  async createContact(nuevoContacto: NewContact) {
    const res = await fetch(this.URL_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.authService.token,
      },
      body: JSON.stringify(nuevoContacto)
    });
    if (!res.ok) return;
    const resContact: Contact = await res.json();
    this.contacts.push(resContact);
    this.contactsChanged.next();
    return resContact;
  }

  async deleteContact(id: number): Promise<void> {
    this.contacts = this.contacts.filter(contacto => contacto.id !== id);
    this.contactsChanged.next();

    try {
      const res = await fetch(this.URL_BASE + "/" + id, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + this.authService.token
        }
      });

      if (!res.ok) {
        console.error('Error al eliminar contacto en el servidor');
      }
    } catch (error) {
      console.error('Error de red al eliminar contacto:', error);
    }
  }

  async editContact(contact: Contact) {
    const res = await fetch(this.URL_BASE + "/" + contact.id,{
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.authService.token,
      },
      body: JSON.stringify(contact)
    });
    if (!res.ok) return;
    this.contacts = this.contacts.map(oldContact => oldContact.id === contact.id ? contact : oldContact);
    this.contactsChanged.next();
    return contact;
  }

  async getContacts(): Promise<void> {
    try {
      const res = await fetch(this.URL_BASE, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + this.authService.token
        }
      });
      if (res.ok) {
        const resJson: Contact[] = await res.json();
        this.contacts = resJson;
        this.contactsChanged.next();
      }
    } catch (error) {
      console.error('Error al obtener contactos:', error);
      throw error;
    }
  }

  async getContactById(id: string | number): Promise<Contact | null> {
    try {
      const res = await fetch(this.URL_BASE + "/" + id, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + this.authService.token
        }
      });
      if (res.ok) {
        const resJson: Contact = await res.json();
        return resJson;
      }
      return null;
    } catch (error) {
      console.error('Error al obtener contacto por ID:', error);
      return null;
    }
  }

  getContactByIdLocal(id: number): Contact | undefined {
    return this.contacts.find(contact => contact.id === id);
  }

  refreshContacts(): void {
    this.contactsChanged.next();
  }
  async favoriteContact(id:number | String){
    const res = await fetch(this.URL_BASE + "/" + id + "/favorite", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.authService.token
      }
    });
    if (!res.ok) return;
    this.contacts = this.contacts.map(contacto => {
      if(contacto.id === id){
        return {...contacto, isFavorite: !contacto.isFavorite};
      }
      return contacto;
    });
    return true;
  }
  async updateContact(id: number, updatedContact: Contact): Promise<Contact | null> {
    try {
      const res = await fetch(`${this.URL_BASE}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.authService.token
        },
        body: JSON.stringify(updatedContact)
      });

      if (!res.ok) {
        console.error('Error al actualizar contacto en el servidor');
        return null;
      }

      const updated = await res.json();
      this.contacts = this.contacts.map(c => c.id === id ? updated : c);
      this.contactsChanged.next();
      return updated;
    } catch (error) {
      console.error('Error al actualizar contacto:', error);
      return null;
    }
  }
}
