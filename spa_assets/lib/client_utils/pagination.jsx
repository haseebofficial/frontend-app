import "client_utils/_styles/pagination.scss";
import React from "react";

const Pagination = ({ children, pagination, onChangePage }) => {
  console.log(pagination);

  const pageItem = [];
  for (let i = 1; i <= pagination?.total_pages; i++) {
    pageItem.push(
      <li key={`page_${i}`}>
        <a
          onClick={() => onChangePage(i)}
          className={`pagination-link ${
            i === pagination?.current_page ? "is-current" : ""
          }`}
          aria-label="Page 1"
          aria-current="page"
        >
          {i}
        </a>
      </li>
    );
  }

  return (
    <nav className="pagination" role="navigation" aria-label="pagination">
      <ul className="pagination-list">
        {pageItem}
        {/* <li>
          <a className="pagination-link is-current" aria-label="Page 1" aria-current="page">1</a>
        </li> */}
        {/* <li>
          <a className="pagination-link" aria-label="Goto page 2">2</a>
        </li>
        <li>
          <a className="pagination-link" aria-label="Goto page 3">3</a>
        </li> */}
      </ul>
    </nav>
  );
};

export default Pagination;
