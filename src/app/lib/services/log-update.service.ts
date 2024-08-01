import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({ providedIn: 'root' })
export class LogUpdateService {
  constructor(updates: SwUpdate) {
    updates.versionUpdates.subscribe((e) => {
      switch (e.type) {
        case 'VERSION_DETECTED':
          console.log(`Downloading new app version: ${e.version.hash}`);
          break;
        case 'VERSION_READY':
          console.log(`Current app version: ${e.currentVersion.hash}`);
          console.log(`New app version ready for use: ${e.latestVersion.hash}`);
          break;
        case 'VERSION_INSTALLATION_FAILED':
          console.log(`Failed to install app version '${e.version.hash}': ${e.error}`);
          break;
      }
    });
  }}
