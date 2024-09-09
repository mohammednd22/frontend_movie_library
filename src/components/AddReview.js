import React, { useState, useEffect } from 'react';
import MovieDataService from "../services/movies";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

const AddReview = ({ user }) => {
    const navigate = useNavigate();
    let params = useParams();
    const location = useLocation();

    const [review, setReview] = useState("");
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (location.state && location.state.currentReview) {
            setReview(location.state.currentReview.review);
            setEditing(true);
        }
    }, [location.state]);

    const onChangeReview = e => {
        const review = e.target.value;
        setReview(review);
    }

    const saveReview = () => {
        const data = {
            review: review,
            name: user.name,
            user_id: user.googleId,
            movie_id: params.id // get movie id from url
        };

        if (editing) {
            MovieDataService.updateReview(location.state.currentReview._id, data)
                .then(response => {
                    navigate("/movies/" + params.id);
                })
                .catch(error => {
                    console.error('Error updating review:', error);
                    if (error.response) {
                        console.error('Error response from server:', error.response.data);
                    }
                });
        } else {
            MovieDataService.createReview(data)
                .then(response => {
                    navigate("/movies/" + params.id);
                })
                .catch(error => {
                    console.error('Error creating review:', error);
                    if (error.response) {
                        console.error('Error response from server:', error.response.data);
                    }
                });
        }
    }

    return (
        <Container className="main-container">
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>{ editing ? "Edit" : "Create" } Review</Form.Label>
                    <Form.Control
                        as="textarea"
                        type="type"
                        required
                        value={review}
                        onChange={onChangeReview}
                    />
                </Form.Group>
                <Button variant="primary" onClick={saveReview}>
                    Submit
                </Button>
            </Form>
        </Container>
    );
}

export default AddReview;
