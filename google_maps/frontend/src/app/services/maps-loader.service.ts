import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapsLoaderService {
  private loadPromise: Promise<typeof google> | null = null;
  private currentKey: string = '';

  constructor() {}

  public load(apiKey: string): Promise<typeof google> {
    if (this.loadPromise && this.currentKey === apiKey) {
      return this.loadPromise;
    }

    this.currentKey = apiKey;

    if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
      return Promise.resolve(google);
    }

    this.loadPromise = new Promise((resolve, reject) => {
      // Check if script already appended
      const existingScript = document.getElementById('google-maps-script');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.type = 'text/javascript';
      const keyParam = apiKey ? `key=${apiKey}&` : '';
      script.src = `https://maps.googleapis.com/maps/api/js?${keyParam}libraries=places,drawing,geometry&v=weekly`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (typeof google !== 'undefined') {
          resolve(google);
        } else {
          reject(new Error('Google Maps script loaded but google is undefined.'));
        }
      };

      script.onerror = (err) => {
        reject(err);
      };

      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  public isLoaded(): boolean {
    return typeof google !== 'undefined' && typeof google.maps !== 'undefined';
  }
}
