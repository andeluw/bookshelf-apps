const books = [];
const RENDER_EVENT = 'render-book'
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function generateId(){
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete){
    return{
        id,
        title,
        author,
        year,
        isComplete
    }
}

function findBook(bookId){
  for(const book of books){
    if(book.id === bookId) return book;
  }
  return null;
}

function findBookIndex(bookId){
  for(const index in books){
    if(books[index].id === bookId) return index;
  }
  return -1;
}

function isStorageExist(){
  return typeof(Storage) !== 'undefined';
}

function saveData(){
  if(isStorageExist()){
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}


function loadDataFromStorage(){
  let serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if(data !== null){
    for(const book of data){
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function addBook(){
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const bookIsComplete = document.getElementById('inputBookIsComplete').checked;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, parseInt(bookYear), bookIsComplete);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFromCompleted(bookId){
  const bookTarget = findBook(bookId);
  if(bookTarget == null) return;
  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBookToCompleted(bookId){
  const bookTarget = findBook(bookId);
  if(bookTarget == null) return;
  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function deleteBook(bookId){
  const index = findBookIndex(bookId);
  if(index == -1) return;
  books.splice(index, 1);
  document.dispatchEvent(new Event (RENDER_EVENT));
  saveData();
}

function makeBook(bookObject){
    const{id, title, author, year, isComplete} = bookObject;

    const textTitle = document.createElement('h3');
    textTitle.innerText = title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = ("Penulis: " + author);

    const textYear = document.createElement('p');
    textYear.innerText = ("Tahun: " + year);

    const greenButton = document.createElement('button');
    greenButton.classList.add('green');

    if(isComplete){
      greenButton.innerText = "Belum Selesai dibaca";
      greenButton.addEventListener('click', function(){
        undoBookFromCompleted(id);
      });
    } else{
      greenButton.innerText = "Selesai dibaca";
      greenButton.addEventListener('click', function(){
        addBookToCompleted(id);
      });
    }

    const redButton = document.createElement('button');
    redButton.classList.add('red');
    redButton.innerText = "Hapus buku";

    redButton.addEventListener('click', function(){
      deleteBook(id);
      alert(`Anda telah menghapus buku ${title}`);
    });

    const action = document.createElement('div');
    action.classList.add('action');
    action.append(greenButton, redButton);

    const container = document.createElement('section');
    container.classList.add('book_item');
    container.setAttribute('id', `book-${id}`);

    container.append(textTitle, textAuthor, textYear, action);

    return container;
}

function filterbook() {
  const filteredTitle = document.getElementById('searchBookTitle').value.toLowerCase();
  const bookList = document.querySelectorAll('.book_item > h3');

  for (let book of bookList) {
    const bookTitle = book.innerText.toLowerCase();
    if (!bookTitle.includes(filteredTitle)) {
      book.parentElement.style.display = 'none';
    } else {
      book.parentElement.style.display = 'block';
    }
  }
}


document.addEventListener('DOMContentLoaded', function(){
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function(event){
      event.preventDefault();
      addBook();
  });

  const searchForm = document.getElementById('searchSubmit');
  searchForm.addEventListener('click', function(event){
    event.preventDefault();
    filterbook();
  });

  if(isStorageExist()){
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function(){
    const belumDibacaList = document.getElementById('incompleteBookshelfList');
    belumDibacaList.innerHTML = '';

    const sudahDibacaList = document.getElementById('completeBookshelfList');
    sudahDibacaList.innerHTML = '';

    for(const bookItem of books){
        const bookElement = makeBook(bookItem);
        if(bookItem.isComplete) sudahDibacaList.append(bookElement);
        else belumDibacaList.append(bookElement);
    }
});

const tombolcheckbox = document.querySelector("input[id=inputBookIsComplete]");
tombolcheckbox.addEventListener('change', function(){
  const spanbutton = document.getElementById('bookStatus');
  if(inputBookIsComplete.checked){
    spanbutton.innerText = 'Selesai dibaca';
  } else{
    spanbutton.innerHTML = 'Belum selesai dibaca';
  }
});

document.addEventListener(SAVED_EVENT, function(){
  console.log(localStorage.getItem(STORAGE_KEY));
})