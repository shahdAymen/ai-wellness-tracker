export class ApiError extends Error {
  constructor({ message, status, code, details, raw, kind = 'client', messages = [], requestUrl = '' }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details || {};
    this.raw = raw;
    this.kind = kind;
    this.messages = messages;
    this.requestUrl = requestUrl;
  }
}

const EMPTY_MARKERS = ['data.datanotfound', 'notfound'];
function flattenValidationErrors(errors) {
  if (!errors || typeof errors !== 'object' || Array.isArray(errors)) return {};

  return Object.entries(errors).reduce((acc, [field, value]) => {
    acc[field] = Array.isArray(value) ? value.join(' ') : String(value);
    return acc;
  }, {});
}

function collectMessages(data, validationErrors) {
  const directErrors = Array.isArray(data?.errors) ? data.errors.map(String) : [];
  const extensionErrors = Array.isArray(data?.extensions?.errors)
    ? data.extensions.errors.map(String)
    : [];
  const fieldErrors = Object.values(validationErrors);

  return [
    ...directErrors,
    ...extensionErrors,
    ...fieldErrors,
  ].filter(Boolean);
}

function includesMarker(messages, markers) {
  return messages.some((message) => {
    const normalized = String(message).toLowerCase();
    return markers.some((marker) => normalized.includes(marker));
  });
}

function classifyApiError({ response, status, messages, requestUrl }) {
  if (!response) return 'network';
  if (status === 401 || status === 403) return 'auth';
  if (status >= 500) return 'server';

  if (requestUrl.includes('/GoogleFit/') && (includesMarker(messages, EMPTY_MARKERS) || status === 404 || status === 400)) {
    return 'integration';
  }

  if (includesMarker(messages, EMPTY_MARKERS) || status === 404) {
    return 'empty';
  }

  return 'client';
}

export function isEmptyStateError(error) {
  return error?.kind === 'empty';
}

export function isIntegrationError(error) {
  return error?.kind === 'integration';
}

export function isFatalApiError(error) {
  return ['network', 'auth', 'server'].includes(error?.kind);
}

export function unwrapSettledResult(result, options = {}) {
  const {
    emptyValue = null,
    allowEmpty = true,
    allowIntegration = false,
  } = options;

  if (result.status === 'fulfilled') {
    return {
      value: result.value,
      error: null,
      isEmpty: false,
      isIntegrationMissing: false,
    };
  }

  const error = result.reason;

  if (allowIntegration && isIntegrationError(error)) {
    return {
      value: emptyValue,
      error: null,
      isEmpty: true,
      isIntegrationMissing: true,
    };
  }

  if (allowEmpty && isEmptyStateError(error)) {
    return {
      value: emptyValue,
      error: null,
      isEmpty: true,
      isIntegrationMissing: false,
    };
  }

  return {
    value: emptyValue,
    error,
    isEmpty: false,
    isIntegrationMissing: false,
  };
}

export function normalizeApiError(error) {
  if (error instanceof ApiError) return error;

  const response = error?.response;
  const data = response?.data;
  const status = response?.status;
  const requestUrl = error?.config?.url || '';

  if (!response) {
    return new ApiError({
      message: error?.message || 'Network error. Please check your connection.',
      status: 0,
      code: 'NetworkError',
      raw: error,
      kind: 'network',
      requestUrl,
    });
  }

  if (typeof data === 'string') {
    const messages = [data];
    return new ApiError({
      message: data || `Request failed with status ${status}`,
      status,
      raw: data,
      kind: classifyApiError({ response, status, messages, requestUrl }),
      messages,
      requestUrl,
    });
  }

  const validationErrors = flattenValidationErrors(data?.errors);
  const messages = collectMessages(data, validationErrors);

  const message =
    data?.description ||
    data?.message ||
    data?.detail ||
    data?.title ||
    messages.join(' ') ||
    Object.values(validationErrors)[0] ||
    `Request failed with status ${status}`;

  return new ApiError({
    message,
    status,
    code: data?.code,
    details: validationErrors,
    raw: data,
    kind: classifyApiError({ response, status, messages, requestUrl }),
    messages,
    requestUrl,
  });
}
