import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.currentPage;

    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1 and there are other pages
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupButton(curPage, 'next', 'right');
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupButton(curPage, 'prev', 'left');
    }

    // Other page
    if (curPage < numPages) {
      const prev = this._generateMarkupButton(curPage, 'prev', 'left');
      const next = this._generateMarkupButton(curPage, 'next', 'right');

      return [prev, next];
    }

    // Page 1 and there are NO other pages
    return '';
  }

  _generateMarkupButton(page, btnClass, arrowClass) {
    const calcPage = btnClass === 'next' ? page + 1 : page - 1;
    return `
      <button data-goto=${calcPage} class="btn--inline pagination__btn--${btnClass}">
        ${
          arrowClass === 'left'
            ? `<svg class="search__icon">
          <use href="${icons}#icon-arrow-${arrowClass}"></use>
        </svg>
        <span>Page ${calcPage}</span>`
            : ` <span>Page ${calcPage}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-${arrowClass}"></use>
        </svg>`
        }
       
      </button>
    `;
  }
}

export default new PaginationView();
