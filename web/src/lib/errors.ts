import { isApiClientError } from './api'

export function getErrorMessage(error: unknown, fallback: string): string {
	if (isApiClientError(error)) {
		return error.message
	}

	if (error instanceof Error && error.message) {
		return error.message
	}

	return fallback
}

export function isNotFoundError(error: unknown): boolean {
	return isApiClientError(error) && error.status === 404
}
