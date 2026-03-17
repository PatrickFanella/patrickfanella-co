import { useCallback, useEffect, useState } from 'react'

import { fetchProject, fetchProjects, type Project } from './api'

type ResourceState<T> = {
	status: 'loading' | 'success' | 'error'
	data: T | null
	error: unknown
}

const loadingState = <T,>(data: T | null = null): ResourceState<T> => ({
	status: 'loading',
	data,
	error: null,
})

export function useProjects() {
	const [revision, setRevision] = useState(0)
	const requestKey = `projects:${revision}`
	const [state, setState] = useState<(ResourceState<Project[]> & { requestKey: string })>({
		...loadingState<Project[]>(),
		requestKey,
	})

	useEffect(() => {
		let cancelled = false

		fetchProjects()
			.then((projects) => {
				if (!cancelled) {
					setState({ status: 'success', data: projects, error: null, requestKey })
				}
			})
			.catch((error: unknown) => {
				if (!cancelled) {
					setState({ status: 'error', data: null, error, requestKey })
				}
			})

		return () => {
			cancelled = true
		}
	}, [requestKey])

	const retry = useCallback(() => {
		setRevision((value) => value + 1)
	}, [])

	const isCurrentRequest = state.requestKey === requestKey

	return {
		projects: isCurrentRequest ? state.data ?? [] : [],
		status: isCurrentRequest ? state.status : 'loading',
		error: isCurrentRequest ? state.error : null,
		retry,
	}
}

export function useProject(slug: string | undefined) {
	const [revision, setRevision] = useState(0)
	const requestKey = slug ? `project:${slug}:${revision}` : `project:missing:${revision}`
	const [state, setState] = useState<(ResourceState<Project> & { requestKey: string })>({
		...loadingState<Project>(),
		requestKey,
	})

	useEffect(() => {
		if (!slug) {
			return
		}

		let cancelled = false

		fetchProject(slug)
			.then((project) => {
				if (!cancelled) {
					setState({ status: 'success', data: project, error: null, requestKey })
				}
			})
			.catch((error: unknown) => {
				if (!cancelled) {
					setState({ status: 'error', data: null, error, requestKey })
				}
			})

		return () => {
			cancelled = true
		}
	}, [requestKey, slug])

	const retry = useCallback(() => {
		setRevision((value) => value + 1)
	}, [])

	if (!slug) {
		return {
			project: null,
			status: 'error' as const,
			error: new Error('A project slug is required to load this route.'),
			retry,
		}
	}

	const isCurrentRequest = state.requestKey === requestKey

	return {
		project: isCurrentRequest ? state.data : null,
		status: isCurrentRequest ? state.status : 'loading',
		error: isCurrentRequest ? state.error : null,
		retry,
	}
}
