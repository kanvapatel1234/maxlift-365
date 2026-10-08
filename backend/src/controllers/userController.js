import { getUserById } from '../services/authService.js';
import { getUserDashboardStats } from '../services/workoutService.js';

/**
 * @desc    Get current user profile and workout statistics
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);
    const stats = await getUserDashboardStats(req.user.id);

    return res.status(200).json({
      success: true,
      data: {
        user,
        stats
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard metrics for current user
 * @route   GET /api/users/stats
 * @access  Private
 */
export const getUserStats = async (req, res, next) => {
  try {
    const stats = await getUserDashboardStats(req.user.id);

    return res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};
