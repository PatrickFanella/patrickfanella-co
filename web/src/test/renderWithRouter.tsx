import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

export function renderInRouter(ui: ReactElement, route = '/') {
	return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>)
}

export function renderRoute(ui: ReactElement, path: string, route: string) {
	return render(
		<MemoryRouter initialEntries={[route]}>
			<Routes>
				<Route element={ui} path={path} />
			</Routes>
		</MemoryRouter>,
	)
}
