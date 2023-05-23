/* eslint-disable @typescript-eslint/no-explicit-any */
export const showLoading = () => {
  const loading: any = document.getElementById('loading');
  loading.classList.remove('hidden');

  loading.classList.add('shown');
};

export const hideLoading = () => {
  const loading: any = document.getElementById('loading');
  loading.classList.remove('shown');
  loading.classList.add('hidden');
};
