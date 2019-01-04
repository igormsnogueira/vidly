import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";

const Pagination = ({ itemsCount, pageSize, onPageChange, currentPage }) => {
  const pagesCount = Math.ceil(itemsCount / pageSize); // o numero de paginas é sempre o numero de itens / tamanho de cada página(numero de itens por pagina), usamos o math.ceil para arredondar para o maior inteiro acima desse valor (truncar)
  if (pagesCount === 1) return null; //se tiver só uma pagina, nao precisa de paginação logo esse componente retorna vazio
  const pages = _.range(1, pagesCount + 1); //funcao range do underscore que cria um array do numero passado no argumento 1 ate o numero passado no argumento2 (-1)

  return (
    <nav>
      <ul className="pagination">
        {pages.map(page => (
          <li
            key={page}
            className={
              page === currentPage
                ? "page-item active"
                : "page-item" /*se a pagina atual for essa pagina ela ganha a classe active que muda o fundo do icone da pagina*/
            }
          >
            <a className="page-link" onClick={() => onPageChange(page)}>
              {page}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

Pagination.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
};

export default Pagination;
