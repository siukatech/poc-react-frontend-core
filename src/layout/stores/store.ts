import {
  // EnhancedStore,
  // Reducer,
  configureStore,
  combineReducers,
  combineSlices,
  createSlice,
  createStore,
  // Slice,
  // Store,
} from '@reduxjs/toolkit';
import type {
  EnhancedStore,
  Reducer,
  Slice,
  Store,
} from '@reduxjs/toolkit';

// import { CombinedSliceReducer } from '@reduxjs/toolkit/dist/combineSlices';
import { authSliceReducer } from '../../auth';
// // import { rootSliceReducer } from './slices';

import { sliceMap } from './slices';

// const initialReducer = {};

const preloadedState = {};

const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    // app: createSlice({
    //   name: 'app',
    //   initialState: {} as any,
    //   reducers: {},
    // }),
  } as any,
  // reducer: sliceMap,
  // preloadedState: preloadedState,
});

// type EnhancedStoreRj = EnhancedStore & {
//   getRootSliceReducer: () => any;
//   injectSliceReducer: (newSliceReducer: any) => void;
// };
// const store: EnhancedStoreRj = (() => {
//   let s: any = configureStore({
//     // reducer: initialReducer,
//     // reducer: rootSliceReducer,
//     reducer: {
//       auth: authSlice,
//     },
//     preloadedState: preloadedState,
//   });
//   s.getRootSliceReducer = () => {
//     return rootSliceReducer;
//   };
//   s.injectSliceReducer = (newSliceReducer: any) => {
//     // rootSliceReducer = combineSlices.apply(newSliceReducers) as any;
//     rootSliceReducer.inject(newSliceReducer);
//   };
//   return s;
// })();

// const store: EnhancedStore & {
//   injectSlice: (key: string, slice: Slice) => void;
// } = (() => {
//   const sliceMap: any = {
//     ['_']: {},
//   };
//   let s: any = configureStore({
//     reducer: { ...sliceMap },
//   });
//   s.injectSlice = (key: string, slice: Slice) => {
//     sliceMap[key] = slice;
//     (s as Store).replaceReducer(
//       combineReducers({
//         ...sliceMap,
//       })
//     );
//   };
//   return s;
// })();

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
