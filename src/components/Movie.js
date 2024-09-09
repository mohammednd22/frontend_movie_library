import React, { useState, useEffect } from 'react';
import MovieDataService from '../services/movies';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import moment from 'moment';
import './Movie.css';

const Movie = ({ user }) => {
  let params = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState({
    id: null,
    title: "",
    rated: "",
    plot: "",
    poster: "",
    reviews: []
  });

  useEffect(() => {
    const getMovie = async (id) => {
      try {
        const response = await MovieDataService.get(id);
        setMovie(response.data);
      } catch (error) {
        console.error('Cant Fetch the Movie:', error);
      }
    };
    getMovie(params.id);
  }, [params.id]);

  const deleteReview = (reviewId, index) => {
    const data = {
      review_id: reviewId,
      user_id: user.googleId
    };

    MovieDataService.deleteReview(data)
      .then(response => {
        setMovie((prevState) => {
          const updatedReviews = [...prevState.reviews];
          updatedReviews.splice(index, 1);
          return {
            ...prevState,
            reviews: updatedReviews
          };
        });
        console.log(response.data);
        // Navigate to the movies list page after successful deletion
        navigate("/movies");
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <div className="poster">
              <Image
                className="bigPicture"
                src={movie.poster ? movie.poster + "/100px250" : "/images/moviePoster.jpeg"}
                onError={(e) => {
                  e.target.src = "/images/moviePoster.jpeg";
                }}
                fluid
              />
            </div>
          </Col>
          <Col>
            <Card>
              <Card.Header as="h5">{movie.title}</Card.Header>
              <Card.Body>
                <Card.Text>
                  {movie.plot}
                </Card.Text>
                { user && 
                  <Link to={"/movies/"+params.id+"/review"}>
                    Add Review
                  </Link>}
              </Card.Body>
            </Card>
            <h2>Reviews</h2>
            <br />
            { movie.reviews.map((review, index) => {
              return (
                <div className="d-flex" key={index}>
                  <div className="flex-shrink-0 reviewsText">
                    <h5>{review.name + " reviewed on " } {moment(review.data).format("Do MMM YYYY") }</h5>
                    <p className="review">{review.review}</p>
                    { user && user.googleId === review.user_id &&
                      <Row>
                        <Col>
                          <Link to={{
                            pathname: "/movies/"+params.id+"/review/"
                          }}
                            state = {{
                              currentReview: review
                          }} >
                            Edit
                          </Link>
                        </Col>
                        <Col>
                          <Button variant="link" onClick={() => deleteReview(review._id, index)}>
                            Delete
                          </Button>
                        </Col>
                      </Row>
                      }
                  </div>
                </div>
              )
            })}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Movie;


