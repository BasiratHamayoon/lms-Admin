import { createSlice } from '@reduxjs/toolkit';
import asyncThunkRequest from '@utils/asyncThunkRequest';

const dummyData = [
  {
    userId: 'u001',
    fullName: 'Mohammad Yaseen',
    email: 'yaseen@example.com',
    phone: '+966500000001',
    status: 'ACTIVE',
    password: 'pass123'
  },
  {
    userId: 'u002',
    fullName: 'Ali Khan',
    email: 'ali@example.com',
    phone: '+966500000002',
    status: 'BLOCKED',
    password: 'pass123'
  },
  {
    userId: 'u003',
    fullName: 'Sara Ahmed',
    email: 'sara@example.com',
    phone: '+966500000003',
    status: 'PENDING',
    password: 'pass123'
  },
  {
    userId: 'u004',
    fullName: 'Usman Farooq',
    email: 'usman@example.com',
    phone: '+966500000004',
    status: 'ACTIVE',
    password: 'pass123'
  },
  {
    userId: 'u005',
    fullName: 'Ayesha Noor',
    email: 'ayesha@example.com',
    phone: '+966500000005',
    status: 'PENDING',
    password: 'pass123'
  }
];

const generateShortId = () => Math.random().toString(36).substr(2, 5);

export const createUser = asyncThunkRequest('user/create', body => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        data: {
          userId: generateShortId(),
          fullName: body?.fullName,
          email: body?.email,
          phone: body?.phone,
          status: body?.status,
          password: body?.password
        }
      });
    }, 1000);
  });
});

export const fetchAllUsers = asyncThunkRequest('user/fetchAll', () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        data: {
          userData: dummyData,
          totalRecords: dummyData.length,
          page: 1,
          totalPages: 10
        }
      });
    }, 1000);
  });
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    listLoading: false,
    data: [],
    error: null,
    totalRows: 0,
    page: 1,
    perPage: 10,
    totalPages: 0,
    selectedUser: null
  },
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setPerPage(state, action) {
      state.perPage = action.payload;
    },
    setSelectedUser(state, { payload }) {
      state.selectedUser = payload;
    },
    removeUserForce(state, { payload }) {
      const index = state.data.findIndex(user => user.userId === payload);
      if (index !== -1) {
        state.data.splice(index, 1); // removes 1 item at found index
      }
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAllUsers.pending, state => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, { payload }) => {
        state.listLoading = false;
        state.data = payload?.userData;
        state.totalPages = payload.totalPages;
        state.totalRows = payload.totalRecords;
        state.page = payload.page;
      })
      .addCase(fetchAllUsers.rejected, (state, { payload, error }) => {
        state.listLoading = false;
        state.error = payload || error?.message || 'Failed to fetch users';
      })
      .addCase(createUser.fulfilled, (state, { payload }) => {
        state.data.unshift(payload);
      });
  }
});
export const { setPage, setPerPage, setSelectedUser, removeUserForce } = userSlice.actions;
export default userSlice.reducer;
