import {
  // Slice,
  combineReducers,
  combineSlices,
  createSlice,
} from '@reduxjs/toolkit';
import type {
  Slice,
} from '@reduxjs/toolkit';
import { authSlice } from '../../auth';
import store from './store';

// /**
//  * Reference:
//  * https://redux-toolkit.js.org/api/combineSlices
//  */

// interface AppState {
//   tested?: boolean;
// }

// const initialState: AppState = {};

// const appSlice = createSlice({
//   name: 'app',
//   // `createSlice` will infer the state type from the `initialState` argument
//   initialState: initialState,
//   reducers: {
//     testApp: (state, action) => {
//       state.tested = action.payload.tested;
//     },
//   },
// });

// const { testApp } = appSlice.actions;

// // const rootSliceReducer = combineSlices(appSlice, authSlice);

// const appSliceMap: any = {};

// const addToSliceMap = (key: string, slice: Slice) => {
//   appSliceMap[key] = slice;
// }
// const getAppSliceMap = () => {
//   return appSliceMap;
// }

// // store.replaceReducer(
// //   combineReducers({
// //     auth: authSlice,
// //     app: appSlice,
// //   })
// // );
// // store.injectSlice('app', appSlice);

// export {
//   // rootSliceReducer,
//   testApp,
// };

const sliceMap = {
  _: {},
  auth: authSlice,
} as any;

export { sliceMap };
