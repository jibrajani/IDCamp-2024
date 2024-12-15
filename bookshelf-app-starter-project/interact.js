document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('bookForm');
    const searchBookForm = document.getElementById('searchBook');
    loadBooksFromStorage();
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });
    searchBookForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const searchTitle = document.getElementById('searchBookTitle').value;
        if (searchTitle) {
            const filteredBooks = books.filter((book) =>
                book.title.includes(searchTitle)
            );
            renderBooks(filteredBooks);
            document.getElementById('incompleteBook').style.display = 'block'
            document.getElementById('completeBook').style.display = 'block'
        }
    });
});
let books = [];
const STORAGE_KEY = 'BOOKSHELF_APP';
const RENDER_EVENT = 'render-book';
const navigation = document.querySelector('.side-bar');
document.querySelector('#info').onclick = () => {
    navigation.classList.toggle('active');
};
function addBook() {
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = parseInt(document.getElementById('bookFormYear').value);
    const isComplete = document.getElementById('bookFormIsComplete').checked;
    const bookFormat = generateBookFormat(generateId(), title, author, year, isComplete);
    books.push(bookFormat);
    saveBooksToStorage();
    document.dispatchEvent(new Event(RENDER_EVENT));
    document.getElementById('bookForm').reset(); 
}
function generateId() {
    return Number(new Date());
}
function generateBookFormat(id, title, author, year, isComplete) {
    return { 
        id, 
        title, 
        author, 
        year, 
        isComplete 
    };
}
function renderBooks(bookList = books) {

    const incompleteBook = document.getElementById('incompleteBook');
    incompleteBook.style.display = 'block'
    incompleteBook.setAttribute('data-testid','incompleteBookList');
    const completeBookList = document.getElementById('completeBook');
    completeBookList.style.display = 'block'
    completeBookList.setAttribute('data-testid','completeBookList');
    
    incompleteBook.innerHTML = '';
    completeBookList.innerHTML = '';
    bookList.forEach((book) => {
        const bookElement = createBookElement(book);
        if (book.isComplete) {
            completeBookList.appendChild(bookElement);
        } else {
            incompleteBook.appendChild(bookElement);
        }
    });
}
function createBookElement(book) {
    const bookElement = document.createElement('div');
    bookElement.dataset.bookid = book.id;
    bookElement.setAttribute('data-testid','bookItem');
    bookElement.innerHTML = `
        <h2 data-testid="bookItemTitle">${book.title}</h2>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <div style="display: flex; flex-direction: column; margin-inline: 90px; margin-block: 5px;">
            <button style="padding: 5px; background-color: rgb(17, 167, 17); box-shadow: 0px 0px 6px rgb(17, 167, 17); border-radius: 7px; margin-block: 10px;" data-testid="bookItemIsCompleteButton">
                ${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}
            </button>
            <button style="padding: 5px; background-color: rgb(221, 27, 27); box-shadow: 0px 0px 6px rgb(221, 27, 27); border-radius: 7px; margin-block: 5px 15px;" data-testid="bookItemDeleteButton">Hapus</button>
            <button style="padding: 5px; background-color: rgb(226, 0, 215); box-shadow: 0px 0px 6px rgb(226, 0, 215); border-radius: 7px;" data-testid="bookItemEditButton">Edit</button>
        </div>
    `;
    const completeButton = bookElement.querySelector('[data-testid="bookItemIsCompleteButton"]');
    completeButton.addEventListener('click', () => toggleBookCompletion(book.id));
    const deleteButton = bookElement.querySelector('[data-testid="bookItemDeleteButton"]');
    deleteButton.addEventListener('click', () => deleteBook(book.id));
    const editButton = bookElement.querySelector('[data-testid="bookItemEditButton"]');
    editButton.addEventListener('click', () => editBook(book.id));
    return bookElement;
}
function toggleBookCompletion(bookId) {
    const book = books.find((book) => book.id === bookId);
    if (book) {
        book.isComplete = !book.isComplete;
        saveBooksToStorage();
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}
function deleteBook(bookId) {
    const bookIndex = books.findIndex((book) => book.id === bookId);
    if (bookIndex !== -1) {
        books.splice(bookIndex, 1); 
    }
    saveBooksToStorage();
    document.dispatchEvent(new Event(RENDER_EVENT));
}
function editBook(bookId) {
    const book = books.find((book) => book.id === bookId);
    if (book) {
        const newTitle = prompt('Edit Judul', book.title);
        const newAuthor = prompt('Edit Penulis', book.author);
        const newYear = prompt('Edit Tahun', book.year);
        
        if (newTitle) book.title = newTitle;
        if (newAuthor) book.author = newAuthor;
        if (newYear) book.year = newYear;
        
        saveBooksToStorage();
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}
function saveBooksToStorage(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}
function loadBooksFromStorage(){
    const storedBooks = localStorage.getItem('BOOKSHELF_APP');
    if (storedBooks){
        books = JSON.parse(storedBooks);
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}
document.addEventListener(RENDER_EVENT, function () {
    renderBooks();
});
