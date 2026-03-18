import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

export function renderInRouter(ui: ReactElement, route = '/') {
	return render(
		<HelmetProvider>
			<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
		</HelmetProvider>,
	)
}

export function renderRoute(ui: ReactElement, path: string, route: string) {
	return render(
		<HelmetProvider>
			<MemoryRouter initialEntries={[route]}>
				<Routes>
					<Route element={ui} path={path} />
				</Routes>
			</MemoryRouter>
		</HelmetProvider>,
	)
}
