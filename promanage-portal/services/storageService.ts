
import { Project, Client, ContactResponse, Subscription } from '../types';

const KEYS = {
  PROJECTS: 'pm_projects',
  CLIENTS: 'pm_clients',
  CONTACTS: 'pm_contacts',
  SUBSCRIPTIONS: 'pm_subscriptions',
};

// Initial Data
const DEFAULT_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Metropolitan Tower',
    description: 'A luxurious residential complex in the heart of the city featuring smart home automation.',
    image: 'https://picsum.photos/seed/tower/450/350',
  },
  {
    id: '2',
    name: 'Green Oasis Hub',
    description: 'Eco-friendly office spaces designed with sustainability and employee wellness in mind.',
    image: 'https://picsum.photos/seed/oasis/450/350',
  },
];

const DEFAULT_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    designation: 'Real Estate Developer',
    description: 'The team at ProManage delivered beyond our expectations. Their attention to detail is unmatched.',
    image: 'https://picsum.photos/seed/sarah/450/350',
  },
];

export const storageService = {
  getProjects: (): Project[] => {
    const data = localStorage.getItem(KEYS.PROJECTS);
    return data ? JSON.parse(data) : DEFAULT_PROJECTS;
  },
  saveProject: (project: Project) => {
    const projects = storageService.getProjects();
    const updated = [...projects, project];
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(updated));
  },
  deleteProject: (id: string) => {
    const projects = storageService.getProjects();
    const updated = projects.filter(p => p.id !== id);
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(updated));
  },

  getClients: (): Client[] => {
    const data = localStorage.getItem(KEYS.CLIENTS);
    return data ? JSON.parse(data) : DEFAULT_CLIENTS;
  },
  saveClient: (client: Client) => {
    const clients = storageService.getClients();
    const updated = [...clients, client];
    localStorage.setItem(KEYS.CLIENTS, JSON.stringify(updated));
  },
  deleteClient: (id: string) => {
    const clients = storageService.getClients();
    const updated = clients.filter(c => c.id !== id);
    localStorage.setItem(KEYS.CLIENTS, JSON.stringify(updated));
  },

  getContacts: (): ContactResponse[] => {
    const data = localStorage.getItem(KEYS.CONTACTS);
    return data ? JSON.parse(data) : [];
  },
  saveContact: (contact: ContactResponse) => {
    const contacts = storageService.getContacts();
    const updated = [contact, ...contacts];
    localStorage.setItem(KEYS.CONTACTS, JSON.stringify(updated));
  },

  getSubscriptions: (): Subscription[] => {
    const data = localStorage.getItem(KEYS.SUBSCRIPTIONS);
    return data ? JSON.parse(data) : [];
  },
  saveSubscription: (sub: Subscription) => {
    const subs = storageService.getSubscriptions();
    const updated = [sub, ...subs];
    localStorage.setItem(KEYS.SUBSCRIPTIONS, JSON.stringify(updated));
  },
};
