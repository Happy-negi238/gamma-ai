export const AUTH_LOGIN_PATH = '/login';
export const AUTH_API_PREFIX = '/api/auth';
export const INNGEST_API_PATH = '/api/inngest';

const PUBLIC_PREFIXES = [AUTH_API_PREFIX, INNGEST_API_PATH];

export function isPublicPath(pathName: string) {
  return PUBLIC_PREFIXES.some((prefix) => pathName.startsWith(prefix));
}

export function isLoginPath(pathName: string) {
  return pathName === '/login';
}

export function toInternalPath(path: string | undefined) {
  if (
    !path ||
    !path.startsWith('/') ||
    path.startsWith('//') ||
    path.includes('\\')
  ) {
    return '/';
  }

  return path;
}
