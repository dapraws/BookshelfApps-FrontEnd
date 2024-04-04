document.addEventListener("DOMContentLoaded", function () {
  const inputBookForm = document.getElementById("inputBook");
  const searchBookForm = document.getElementById("searchBook");
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );
  let books = JSON.parse(localStorage.getItem("books")) || [];

  renderBooks();

  inputBookForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = document.getElementById("inputBookYear").value;
    const isComplete = document.getElementById("inputBookIsComplete").checked;

    const book = {
      id: +new Date(),
      title: title,
      author: author,
      year: parseInt(year),
      isComplete: isComplete,
    };

    books.push(book);
    saveBooks();
    renderBooks();

    inputBookForm.reset(); // Reset form after adding book
    console.log("New book added:", book);
  });

  searchBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const searchTitle = document
      .getElementById("searchBookTitle")
      .value.trim()
      .toLowerCase();
    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(searchTitle)
    );
    renderBooks(filteredBooks);
    console.log("Books searched with title:", searchTitle);
  });

  function renderBooks(filteredBooks = books) {
    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";

    filteredBooks.forEach(function (book) {
      const bookItem = createBookItem(book);
      if (book.isComplete) {
        completeBookshelfList.appendChild(bookItem);
      } else {
        incompleteBookshelfList.appendChild(bookItem);
      }
    });
  }

  function createBookItem(book) {
    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item");
    bookItem.setAttribute("id", book.id);

    const bookTitle = document.createElement("h3");
    bookTitle.innerText = book.title;

    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = "Penulis: " + book.author;

    const bookYear = document.createElement("p");
    bookYear.innerText = "Tahun: " + book.year;

    const actionDiv = document.createElement("div");
    actionDiv.classList.add("action");

    const buttonComplete = document.createElement("button");
    buttonComplete.innerText = book.isComplete ? "Undo" : "Done";
    buttonComplete.classList.add(book.isComplete ? "yellow" : "green");
    buttonComplete.addEventListener("click", function () {
      toggleBookStatus(book);
    });

    const buttonDelete = document.createElement("button");
    buttonDelete.innerText = "Delete";
    buttonDelete.classList.add("red");
    buttonDelete.addEventListener("click", function () {
      deleteBook(book);
    });

    actionDiv.appendChild(buttonComplete);
    actionDiv.appendChild(buttonDelete);

    bookItem.appendChild(bookTitle);
    bookItem.appendChild(bookAuthor);
    bookItem.appendChild(bookYear);
    bookItem.appendChild(actionDiv);

    return bookItem;
  }

  function toggleBookStatus(book) {
    book.isComplete = !book.isComplete;
    saveBooks();
    renderBooks();
    console.log("Book status toggled:", book);
  }

  function deleteBook(book) {
    books = books.filter(function (b) {
      return b.id !== book.id;
    });
    saveBooks();
    renderBooks();
    console.log("Book deleted:", book);
  }

  function saveBooks() {
    localStorage.setItem("books", JSON.stringify(books));
  }
});
