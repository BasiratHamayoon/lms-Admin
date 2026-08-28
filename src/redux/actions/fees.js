
import axiosInstance from '../../utils/axiosInstance';

export const getFeeStructuresListAPI = async (queryParams) => {
  try {
    const { data } = await axiosInstance.get('/fee-structures', { params: queryParams });
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const createFeeStructureAPI = async (feeStructureData) => {
  try {
    const { data } = await axiosInstance.post('/fee-structures', feeStructureData);
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const getFeeStructureDetailsAPI = async (id) => {
  try {
    const { data } = await axiosInstance.get(`/fee-structures/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const updateFeeStructureAPI = async (id, feeStructureData) => {
  try {
    const { data } = await axiosInstance.put(`/fee-structures/${id}`, feeStructureData);
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const deleteFeeStructureAPI = async (id) => {
  try {
    const { data } = await axiosInstance.delete(`/fee-structures/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const getStudentFeesListAPI = async (queryParams) => {
  try {
    const { data } = await axiosInstance.get('/student-fees', { params: queryParams });
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const assignFeeStructureAPI = async (assignmentData) => {
  try {
    const { data } = await axiosInstance.post('/student-fees/assign', assignmentData);
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const getStudentFeeDetailsAPI = async (id) => {
  try {
    const { data } = await axiosInstance.get(`/student-fees/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const recordFeePaymentAPI = async (paymentData) => {
  try {
    const { data } = await axiosInstance.post('/student-fees/payment', paymentData);
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const addFeeDiscountAPI = async (id, discountData) => {
  try {
    const { data } = await axiosInstance.post(`/student-fees/${id}/discount`, discountData);
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const getFeeStatsAPI = async (queryParams) => {
  try {
    const { data } = await axiosInstance.get('/fee-stats', { params: queryParams });
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const getFeeCollectionChartAPI = async (year) => {
  try {
    const { data } = await axiosInstance.get('/fee-collection-chart', { params: { year } });
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const getFeeStatusChartAPI = async () => {
  try {
    const { data } = await axiosInstance.get('/fee-status-chart');
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};


export const getStudentOptionsAPI = async (queryParams) => {
  try {
    const { data } = await axiosInstance.get('/student-options', { params: queryParams });
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};



export const deleteStudentFeeAPI = async (id) => {
  try {
    const { data } = await axiosInstance.delete(`/student-fees/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const deleteFeePaymentAPI = async (id) => {
  try {
    const { data } = await axiosInstance.delete(`/fee-transactions/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};