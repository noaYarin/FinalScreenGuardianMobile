import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../redux/slices/auth-slice';
import childrenReducer from "../slices/children-slice";
import devicesReducer from "../slices/device-slice";
import requestsReducer from "../slices/requests-slice";
import parentHomeReducer from "../slices/parentHome-slice";
import { injectDispatch } from '../../api/request';
import notificationsReducer from "../slices/notification-slice";
import auditSliceReducer from "../slices/audit-slice";
import tasksReducer from "../slices/tasks-slice";
import rewardsReducer from "../slices/rewards-slice";
import achievementsReducer from "../slices/achievements-slice";
import childThemeReducer from "../slices/child-theme-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    children: childrenReducer,
    devices: devicesReducer,
    requests: requestsReducer,
    parentHome: parentHomeReducer,
    notifications: notificationsReducer,
    audit: auditSliceReducer,
    tasks: tasksReducer,
    rewards: rewardsReducer,
    achievements: achievementsReducer,
    childTheme: childThemeReducer,
  },
});

export default store;

