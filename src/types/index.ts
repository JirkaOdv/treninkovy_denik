export type TrainingType = 'strength' | 'cardio' | 'mobility' | 'other';
export type Feeling = 'great' | 'good' | 'average' | 'bad' | 'terrible';

// --- V2: New Data Structures ---

export interface SprintEntry {
    distance: number; // e.g. 60, 100
    count: number;    // number of reps
    bestTime?: number; // seconds, optional
}

export interface GymEntry {
    exercise: string; // e.g. 'Clean', 'Squat'
    weight: number; // kg
    reps?: number;
    sets?: number;
}

export interface JumpEntry {
    type: string; // e.g. 'DZM', 'Petiskok', 'Koule'
    result: number; // meters
}

export interface TrainingSession {
    id: string;
    date: string; // ISO format YYYY-MM-DD
    type: TrainingType;
    durationMinutes: number;
    feeling: Feeling;
    notes?: string;

    // V2 Fields
    sprints?: SprintEntry[];
    gym?: GymEntry[];
    jumps?: JumpEntry[];

    // Totals/Aggregates
    totalDistance?: number; // km (runs/cardio) or m (sprints sum)
    totalLoad?: number; // arbitrary load unit
}

export interface SeasonGoal {
    id: string;
    discipline: string; // e.g. '60m', 'Drep'
    targetValue: number; // target time or weight
    unit: string; // 's', 'kg', 'm'
    category: 'sprint' | 'strength' | 'jump';
}

export interface UserProfile {
    id: string; // uuid
    name: string;
    role: 'admin' | 'user';
    weight?: number; // kg
    height?: number; // cm
    birthDate?: string; // YYYY-MM-DD
    theme?: 'light' | 'dark' | 'system';
}

// Deprecated but kept for compatibility logic if needed (or minimal V1 form)
export interface ExerciseSet {
    reps: number;
    weight: number;
    rpe?: number;
}

export interface Exercise {
    id: string;
    name: string;
    sets: ExerciseSet[];
    notes?: string;
}

export interface WeeklyStats {
    totalDistance: number;
    totalDuration: number;
    sessionCount: number;
}
