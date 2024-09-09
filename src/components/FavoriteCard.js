import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import './FavoriteRanking.css';

const ItemTypes = {
    DNDCARD: 'dndCard',
};

function FavoriteCard({ favorite, index, moveCard }) {
    const ref = useRef(null);

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.DNDCARD,
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: ItemTypes.DNDCARD,
        hover(item, monitor) {
            if (!ref.current) return;

            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) return;

            const hoverBoundingRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

            moveCard(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    drag(drop(ref));

    return (
        <div
            ref={ref}
            className="favoritesCard"
            style={{ opacity: isDragging ? 0.5 : 1, border: '3px solid #a9a9a9' }}
        >
            <div className={`favoritesNumber ${index < 10 ? 'favoritesNumberOneDigit' : 'favoritesNumberTwoDigit'}`}>
                {index + 1}
            </div>
            <img
                className="favoritesPoster"
                src={favorite.poster ? favorite.poster + "/100px180" : "/images/moviePoster.jpeg"}
                alt={favorite.title}
            />
            <div className="favoritesTitle">
                {favorite.title}
            </div>
        </div>
    );
}

export default FavoriteCard;
