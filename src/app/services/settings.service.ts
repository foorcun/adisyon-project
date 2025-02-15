import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  // Mock settings data
  private settings = {
    profile: { name: 'John Doe', email: 'john@example.com' },
    account: { password: '' },
    restaurant: { name: 'My Restaurant', location: '123 Main St' },
    notifications: { orderAlerts: true, reservationAlerts: false },
    users: [],
    apiKeys: [],
  };

  getSettings(section: string) {
    return this.settings[section as keyof typeof this.settings];
  }

  updateSettings(section: string, data: any) {
    this.settings[section as keyof typeof this.settings] = data;
  }
}
