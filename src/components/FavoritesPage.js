import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FavoriteDataService from '../services/favorites';
import MovieDataService from '../services/movies';
import FavoriteCard from './FavoriteCard';
import './FavoriteRanking.css';
import update from 'immutability-helper';

function FavoritePage({ user }) {
    const [favorites, setFavorites] = useState([]);
    const [movies, setMovies] = useState([]);
    const [doSaveFaves, setDoSaveFaves] = useState(false);

    const retrieveFavoriteIds = useCallback(() => {
        if (user && user.googleId) {
            FavoriteDataService.getAll(user.googleId)
                .then(response => {
                    const favoriteMovieIds = response.data.favorites;
                    setFavorites(favoriteMovieIds);
                })
                .catch(e => {
                    console.log(e);
                });
        }
    }, [user]);

    const fetchMovieDetails = useCallback(() => {
        if (favorites.length > 0) {
            Promise.all(favorites.map(fav => MovieDataService.get(fav.movieId)))
                .then(movieDetailsResponse => {
                    const movieDetails = movieDetailsResponse.map(response => response.data);
                    setMovies(movieDetails);
                })
                .catch(e => {
                    console.log(e);
                });
        }
    }, [favorites]);

    useEffect(() => {
        retrieveFavoriteIds();
    }, [retrieveFavoriteIds]);

    useEffect(() => {
        fetchMovieDetails();
    }, [fetchMovieDetails]);

    useEffect(() => {
        if (user && doSaveFaves) {
            FavoriteDataService.updateFavoritesList({ _id: user.googleId, favorites })
                .then(response => {
                    setDoSaveFaves(false);
                })
                .catch(e => {
                    console.log(e);
                });
        }
    }, [favorites, user, doSaveFaves]);

    const moveCard = useCallback((dragIndex, hoverIndex) => {
        setFavorites((prevFavorites) =>
            update(prevFavorites, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, prevFavorites[dragIndex]],
                ],
            })
        );
        setDoSaveFaves(true);
    }, []);

    const favoriteMap = new Map(movies.map(movie => [movie._id, movie]));

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="favoritesContainer">
                <div className="favoritesPanel">
                    Drag your favorites to rank them
                </div>
                <div style={{ width: '500px', margin: '1em' }}>
                    {favorites
                        .map((fav, index) => {
                            const movie = favoriteMap.get(fav.movieId);
                            return (
                                movie && (
                                    <FavoriteCard
                                        key={fav.movieId}
                                        index={index}
                                        favorite={movie}
                                        moveCard={moveCard}
                                    />
                                )
                            );
                        })}
                </div>
            </div>
        </DndProvider>
    );
}

export default FavoritePage;
