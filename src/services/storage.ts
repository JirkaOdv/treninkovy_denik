import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { TrainingSession, SeasonGoal, UserProfile } from '../types';

interface TrainingDB extends DBSchema {
    trainings: {
        key: string;
        value: TrainingSession;
        indexes: { 'by-date': string };
    };
    goals: {
        key: string;
        value: SeasonGoal;
    };
}

const DB_NAME = 'fit-track-db';
const STORE_TRAININGS = 'trainings';
const STORE_GOALS = 'goals';

class dbService {
    private dbPromise: Promise<IDBPDatabase<TrainingDB>>;

    constructor() {
        this.dbPromise = openDB<TrainingDB>(DB_NAME, 2, {
            upgrade(db, oldVersion, _newVersion, _transaction) {
                // Create trainings store if not exists (Version 1)
                if (oldVersion < 1) {
                    const store = db.createObjectStore(STORE_TRAININGS, { keyPath: 'id' });
                    store.createIndex('by-date', 'date');
                }
                // Create goals store (Version 2)
                if (oldVersion < 2) {
                    if (!db.objectStoreNames.contains(STORE_GOALS)) {
                        db.createObjectStore(STORE_GOALS, { keyPath: 'id' });
                    }
                }
            },
        });
    }

    // --- Trainings ---

    async getAllTrainings(): Promise<TrainingSession[]> {
        return (await this.dbPromise).getAll(STORE_TRAININGS);
    }

    async getTrainingById(id: string): Promise<TrainingSession | undefined> {
        return (await this.dbPromise).get(STORE_TRAININGS, id);
    }

    async addTraining(training: TrainingSession): Promise<string> {
        await (await this.dbPromise).put(STORE_TRAININGS, training);
        return training.id;
    }

    async updateTraining(training: TrainingSession): Promise<string> {
        // 'put' overwrites if key exists, acting as update
        await (await this.dbPromise).put(STORE_TRAININGS, training);
        return training.id;
    }

    async deleteTraining(id: string): Promise<void> {
        await (await this.dbPromise).delete(STORE_TRAININGS, id);
    }

    async getTrainingsByDateRange(start: string, end: string): Promise<TrainingSession[]> {
        const db = await this.dbPromise;
        return db.getAllFromIndex(STORE_TRAININGS, 'by-date', IDBKeyRange.bound(start, end));
    }

    // --- Goals ---

    async getAllGoals(): Promise<SeasonGoal[]> {
        return (await this.dbPromise).getAll(STORE_GOALS);
    }

    async saveGoal(goal: SeasonGoal): Promise<string> {
        await (await this.dbPromise).put(STORE_GOALS, goal);
        return goal.id;
    }

    async deleteGoal(id: string): Promise<void> {
        await (await this.dbPromise).delete(STORE_GOALS, id);
    }

    // --- User Profile (LocalStorage) ---

    // --- User Profile (LocalStorage) ---

    getUserProfile(): UserProfile | null {
        try {
            const data = localStorage.getItem('fittrack_profile');
            // Migration: Add ID and Role if missing (for legacy data)
            if (data) {
                const profile = JSON.parse(data);
                if (!profile.id || !profile.role) {
                    const upgradedProfile: UserProfile = {
                        ...profile,
                        id: profile.id || 'admin-user-id', // Fixed ID for initial migration
                        role: profile.role || 'admin'
                    };
                    this.saveUserProfile(upgradedProfile);
                    // Also ensure this user is in the users list
                    this.ensureUserInList(upgradedProfile);
                    return upgradedProfile;
                }
                return profile;
            }
            return null;
        } catch (e) {
            console.error('Failed to parse profile', e);
            return null;
        }
    }

    saveUserProfile(profile: UserProfile): void {
        localStorage.setItem('fittrack_profile', JSON.stringify(profile));
        this.ensureUserInList(profile);
    }

    // List of all users
    getAllUsers(): UserProfile[] {
        try {
            const data = localStorage.getItem('fittrack_users');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    addUser(profile: UserProfile): void {
        const users = this.getAllUsers();
        // Check if exists
        const index = users.findIndex(u => u.id === profile.id);
        if (index >= 0) {
            users[index] = profile;
        } else {
            users.push(profile);
        }
        localStorage.setItem('fittrack_users', JSON.stringify(users));
    }

    ensureUserInList(profile: UserProfile): void {
        this.addUser(profile);
    }

    switchUser(userId: string): void {
        const users = this.getAllUsers();
        const user = users.find(u => u.id === userId);
        if (user) {
            localStorage.setItem('fittrack_profile', JSON.stringify(user));
            // Trigger a page reload or event to refresh state effectively
            window.location.reload();
        }
    }

    deleteUser(userId: string): void {
        const users = this.getAllUsers();
        const newUsers = users.filter(u => u.id !== userId);
        localStorage.setItem('fittrack_users', JSON.stringify(newUsers));

        // If deleting current user, switch to another or clear
        const current = this.getUserProfile();
        if (current && current.id === userId) {
            if (newUsers.length > 0) {
                this.switchUser(newUsers[0].id);
            } else {
                localStorage.removeItem('fittrack_profile');
                window.location.reload();
            }
        }
    }

    // --- System ---

    async clearAllData(): Promise<void> {
        // Clear IndexedDB
        const db = await this.dbPromise;

        // Manual clearing of stores since 'clear' might not be directly exposed by idb wrapper in this way in all versions, 
        // but idb's openDB result usually has .clear on stores. 
        // Let's use transaction for safety or just standard delete operations.
        const tx = db.transaction([STORE_TRAININGS, STORE_GOALS], 'readwrite');
        await Promise.all([
            tx.objectStore(STORE_TRAININGS).clear(),
            tx.objectStore(STORE_GOALS).clear(),
            tx.done
        ]);

        // Clear LocalStorage
        localStorage.removeItem('fittrack_profile');
        localStorage.removeItem('fittrack_users');
        localStorage.removeItem('fittrack_goals'); // Legacy backup if any
    }
}

export const trainingStorage = new dbService();
