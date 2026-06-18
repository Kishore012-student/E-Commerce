import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const Breadcrumb = ({ items }) => {
  if (!items?.length) return null;

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb bg-light p-3 rounded mb-4">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={index}
              className={`breadcrumb-item ${isLast ? 'active' : ''}`}
              aria-current={isLast ? 'page' : undefined}
            >
              {isLast ? (
                <>
                  {index === 0 && <FaHome className="me-1" />}
                  {item.name}
                </>
              ) : (
                <Link to={item.link}>
                  {index === 0 ? <FaHome className="me-1" /> : null}
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
