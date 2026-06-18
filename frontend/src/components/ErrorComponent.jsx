import { FaExclamationTriangle } from 'react-icons/fa';

const ErrorComponent = ({ message = 'Something went wrong', onRetry }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
      <FaExclamationTriangle className="text-danger mb-3" style={{ fontSize: '3rem' }} />
      <h4 className="text-dark mb-2">Oops!</h4>
      <p className="text-muted mb-4">{message}</p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorComponent;
