import View from './View';
import PreviewView from './previewView';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmark yet. Find a fine recipe and bookmark it';
  _message = '';

  // load immediatly (this is something do with localstorage bookmark error problem)
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => PreviewView.render(bookmark, false))
      .join();
  }
}

export default new BookmarksView();
