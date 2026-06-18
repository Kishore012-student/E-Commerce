import Rating from './Rating';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const ReviewCard = ({ review }) => {
  const { user, rating, comment, createdAt } = review;

  const avatarSrc = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=0d6efd&color=fff&size=40`;

  return (
    <div className="card shadow-sm border-0 mb-3">
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          <img
            src={avatarSrc}
            alt={user?.name || 'User'}
            className="rounded-circle me-3"
            width="40"
            height="40"
            style={{ objectFit: 'cover' }}
          />
          <div>
            <h6 className="mb-0 fw-bold">{user?.name || 'Anonymous'}</h6>
            <small className="text-muted">{formatDate(createdAt)}</small>
          </div>
        </div>
        <Rating value={rating} />
        <p className="card-text mt-2 mb-0">{comment}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
