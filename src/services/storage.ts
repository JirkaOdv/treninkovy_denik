import { api } from './api';
import type { TrainingSession, SeasonGoal, UserProfile } from '../types';

class dbService {

    // --- Trainings ---

    async getAllTrainings(): Promise<TrainingSession[]> {
        return api.get('/trainings');
    }

    async getTrainingById(id: string): Promise<TrainingSession | undefined> {
        try {
            return await api.get(`/trainings/${id}`);
        } catch (e) {
            return undefined;
        }
    }

    async addTraining(training: TrainingSession): Promise<string> {
        const result = await api.post('/trainings', training);
        return result.id;
    }

    async updateTraining(training: TrainingSession): Promise<string> {
        const result = await api.put(`/trainings/${training.id}`, training);
        return result.id;
    }

    async deleteTraining(id: string): Promise<void> {
        await api.delete(`/trainings/${id}`);
    }

    async getTrainingsByDateRange(_start: string, _end: string): Promise<TrainingSession[]> {
        // For now return all, filtering should ideally happen on backend
        const all = await this.getAllTrainings();
        // Implement client side filtering or update API to support ranges
        return all.filter(t => t.date >= _start && t.date <= _end);
    }

    // --- Goals (Not fully implemented on API yet) ---

    async getAllGoals(): Promise<SeasonGoal[]> {
        // return api.get('/goals');
        return [];
    }

    async saveGoal(goal: SeasonGoal): Promise<string> {
        // await api.post('/goals', goal);
        return goal.id;
    }

    async deleteGoal(_id: string): Promise<void> {
        // await api.delete(`/goals/${id}`);
    }

    // --- User Profile (Client Side wrapper for compatibility) ---
    // Note: React components should use useAuth() context instead

    getUserProfile(): UserProfile | null {
        try {
            const data = localStorage.getItem('user');
            if (data) return JSON.parse(data);
            return null;
        } catch (e) {
            return null;
        }
    }

    saveUserProfile(profile: UserProfile): void {
        localStorage.setItem('user', JSON.stringify(profile));
        // Note: This won't update AuthContext state automatically. 
        // Components should use updateProfile from context in future.
    }

    getAllUsers(): UserProfile[] {
        return []; // Not supported in client storage anymore, admin API needed
    }

    addUser(_profile: UserProfile): void {
        // Not supported
    }

    ensureUserInList(_profile: UserProfile): void {
        // Not supported
    }

    switchUser(_userId: string): void {
        // Not supported
    }

    deleteUser(_userId: string): void {
        // Not supported
    }

    // --- System ---

    async clearAllData(): Promise<void> {
        localStorage.clear();
    }
}

export const trainingStorage = new dbService();
