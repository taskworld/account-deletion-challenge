const STATUS_PENDING = "pending"; // Nothing is loaded yet.
const STATUS_FETCHING = "fetching"; // Loading the first time or after error.
const STATUS_COMPLETED = "completed"; // Data loaded successfully.
const STATUS_OUTDATED = "outdated"; // Data is known to be outdated.
const STATUS_REFRESHING = "refreshing"; // Data is already loaded but is refreshing.
const STATUS_ERROR = "error"; // Load error.

export const pending = { status: STATUS_PENDING };
const fetching = { status: STATUS_FETCHING };
export const completed = { status: STATUS_COMPLETED };
const outdated = { status: STATUS_OUTDATED };
const refreshing = { status: STATUS_REFRESHING };
export const error = STATUS_ERROR;
const initWithError = error => ({ status: STATUS_ERROR, error });

export const isError = state => state.status === STATUS_ERROR;
export const shouldLoad = state => state.status === STATUS_PENDING || state.status === STATUS_OUTDATED;
export const isLoading = state => state.status === STATUS_PENDING || state.status === STATUS_FETCHING || state.status === STATUS_REFRESHING;
export const isLoadingFirstTime = state => state.status === STATUS_FETCHING;
export const isRefreshing = state => state.status === STATUS_REFRESHING;
export const isLoaded = state => state.status === STATUS_COMPLETED || state.status === STATUS_REFRESHING;

export const handleLoaded = state => completed;
export const handleOutdated = state => outdated;
export const handleLoadRequested = state => {
  return state.status === STATUS_OUTDATED ? refreshing : fetching;
};
export const handleLoadFailedWithError = error => {
  return initWithError(error);
};
