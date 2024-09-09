import { render, waitFor, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import mockServer from '../__mocks__/mockServer';
import Movie from '../components/Movie';

beforeAll(() => mockServer.listen());
afterEach(() => mockServer.resetHandlers());
afterAll(() => mockServer.close());


// Test for displaying the title of a movie and correct number of reviews
test('renders the movie title and the number of reviews', async () => {
  const movieId = '573a1390f29313caabcd4135';
  const movieTitle = 'Blacksmith Scene';

  render(
    <MemoryRouter initialEntries={[`/movies/${movieId}`]}>
      <Routes>
        <Route path="/movies/:id" element={
            <Movie />} />
      </Routes>
    </MemoryRouter>
  );

  await waitFor(() => expect(screen.getByText(movieTitle)).toBeInTheDocument());
});