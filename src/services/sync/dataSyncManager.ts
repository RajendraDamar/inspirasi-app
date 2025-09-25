import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

class DataSyncManager {
  private queueKey = '@sync_queue';
  private queue: any[] = [];
  private unsubscribeNetInfo: (() => void) | null = null;

  async initialize() {
    await this.loadQueue();

    // Try to sync immediately if online
    const net = await NetInfo.fetch();
    if (net.isConnected) await this.performSync();

    // Listen for network changes
    this.unsubscribeNetInfo = NetInfo.addEventListener(async (state) => {
      if (state.isConnected) await this.performSync();
    });
  }

  private async loadQueue() {
    try {
      const raw = await AsyncStorage.getItem(this.queueKey);
      this.queue = raw ? JSON.parse(raw) : [];
    } catch (e) {
      this.queue = [];
    }
  }

  private async saveQueue() {
    await AsyncStorage.setItem(this.queueKey, JSON.stringify(this.queue));
  }

  async queueReport(report: any) {
    this.queue.push({ id: Date.now(), report });
    await this.saveQueue();
  }

  async performSync() {
    while (this.queue.length > 0) {
      const item = this.queue[0];
      try {
        await addDoc(collection(db, 'reports'), { ...item.report, createdAt: new Date() });
        this.queue.shift();
        await this.saveQueue();
      } catch (e) {
        console.error('Failed syncing report', e);
        break; // stop and retry later
      }
    }
  }

  cleanup() {
    try {
      if (this.unsubscribeNetInfo) {
        this.unsubscribeNetInfo();
        this.unsubscribeNetInfo = null;
      }
    } catch (e) {
      // ignore
    }
  }

  // Helper for manual in-app testing: enqueue a sample report and verify queue persistence
  async runSelfTest() {
    const sample = { id: 'selftest_' + Date.now(), report: { authorId: 'test', title: 'selftest', description: 'auto', timestamp: Date.now() } };
    this.queue.push(sample);
    await this.saveQueue();
    // reload
    await this.loadQueue();
    const found = this.queue.find((q: any) => q.id === sample.id);
    return !!found;
  }
}

export default new DataSyncManager();
