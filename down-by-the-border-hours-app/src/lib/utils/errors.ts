export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    if (error.message.includes('Invalid login credentials')) {
      return 'Wrong email or password. Try again.'
    }
    if (error.message.includes('User already registered')) {
      return 'An account with this email already exists.'
    }
    if (error.message.includes('Password should be at least')) {
      return 'Password must be at least 6 characters.'
    }
    return error.message
  }

  return fallback
}
