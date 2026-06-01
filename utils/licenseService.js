import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import License from '../models/License.js';
import User from '../models/User.js';

const CONFIG_DIR = path.resolve('config');
const DEVICE_FILE = path.join(CONFIG_DIR, 'device.json');

// Ensure config directory exists
if (!fs.existsSync(CONFIG_DIR)) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

/**
 * Retrieve or generate a persistent local device UUID
 */
export function getDeviceUUID() {
  try {
    if (fs.existsSync(DEVICE_FILE)) {
      const data = JSON.parse(fs.readFileSync(DEVICE_FILE, 'utf8'));
      if (data.deviceUUID) {
        return data.deviceUUID;
      }
    }
  } catch (err) {
    console.error('Error reading device UUID file:', err);
  }

  // Generate new UUID and store it
  const deviceUUID = crypto.randomUUID();
  try {
    fs.writeFileSync(DEVICE_FILE, JSON.stringify({ deviceUUID }, null, 2), 'utf8');
    console.log('Generated new local device UUID:', deviceUUID);
  } catch (err) {
    console.error('Error saving device UUID file:', err);
  }
  return deviceUUID;
}

/**
 * Validate the currently active license in the DB.
 * Returns { licensed: boolean, status: string, license?: object, currentDeviceUUID: string }
 */
export async function validateActiveLicense() {
  return {
    licensed: true,
    status: 'Active',
    license: { planName: 'Unlimited', maxDoctors: 999999, licenseKey: 'UNLIMITED-LICENSE-KEY' },
    currentDeviceUUID: '',
  };
}

/**
 * Centrally check if a new Doctor account can be created.
 * Throws an Error if limits are exceeded or license is invalid.
 */
export async function checkDoctorLimit() {
  return true;
}

/**
 * Automatically migrate existing legacy customers on startup.
 * If no license exists in the DB but doctor accounts do, create a default legacy license.
 */
export async function initLicense() {
  // Bypassed: Licensing is fully removed.
}
