import api from './api';

export const workoutService = {
  // Muscle groups
  async getMuscleGroups() {
    const response = await api.get('/muscle-groups');
    return response.data.data;
  },

  async getExercisesByMuscleGroup(groupId) {
    const response = await api.get(`/muscle-groups/${groupId}/exercises`);
    return response.data;
  },

  // Exercises
  async getAllExercises(params = {}) {
    const response = await api.get('/exercises', { params });
    return response.data.data;
  },

  async getExerciseById(exerciseId) {
    const response = await api.get(`/exercises/${exerciseId}`);
    return response.data.data;
  },

  async getExerciseWorkouts(exerciseId) {
    const response = await api.get(`/exercises/${exerciseId}/workouts`);
    return response.data.data;
  },

  async getExercisePR(exerciseId) {
    const response = await api.get(`/exercises/${exerciseId}/pr`);
    return response.data.data;
  },

  // Workouts CRUD
  async createWorkout(workoutData) {
    const response = await api.post('/workouts', workoutData);
    return response.data;
  },

  async getMyWorkouts(params = {}) {
    const response = await api.get('/workouts', { params });
    return response.data;
  },

  async deleteWorkout(workoutId) {
    const response = await api.delete(`/workouts/${workoutId}`);
    return response.data;
  },

  // User stats & profile
  async getUserStats() {
    const response = await api.get('/users/stats');
    return response.data.data;
  },

  async getUserProfile() {
    const response = await api.get('/users/profile');
    return response.data.data;
  }
};
