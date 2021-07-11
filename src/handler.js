const {nanoid} = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {name, year, author, summary, publisher, pageCount, readPage, reading} =
    request.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage ? true : false;
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  const isNameGiven = name !== undefined ? true : false;
  const isReadPageValid = readPage <= pageCount ? true : false;
  const index = books.findIndex((book) => book.id === id);

  if (!isNameGiven) {
    books.splice(index, 1);
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (!isReadPageValid) {
    books.splice(index, 1);
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  } else if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const {reading, finished, name} = request.query;
  if (reading !== undefined) {
    if (reading == 0) {
      // return reading:false
      // using filter and map
      const response = h.response({
        status: 'success',
        data: {
          books: books
              .filter((book) => book.reading === false)
              .map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
              })),
        },
      });
      response.code(200);
      return response;
    } else {
      // return reading:true
      // using filter and map
      const response = h.response({
        status: 'success',
        data: {
          books: books
              .filter((book) => book.reading === true)
              .map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
              })),
        },
      });
      response.code(200);
      return response;
    }
  } else if (finished !== undefined) {
    if (finished == 0) {
      // return finished:false
      const response = h.response({
        status: 'success',
        data: {
          books: books
              .filter((book) => book.finished === false)
              .map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
              })),
        },
      });
      response.code(200);
      return response;
    } else {
      // return finished:true
      const response = h.response({
        status: 'success',
        data: {
          books: books
              .filter((book) => book.finished === true)
              .map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
              })),
        },
      });
      response.code(200);
      return response;
    }
  } else if (name !== undefined) {
    // return name:name
    const response = h.response({
      status: 'success',
      data: {
        books: books
            .filter(
                (book) =>
                  book.name.toLowerCase().includes(name.toLowerCase()) === true,
            )
            .map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'success',
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const {bookId} = request.params;
  const book = books.filter((n) => n.id === bookId)[0];

  if (book != undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const {bookId} = request.params;
  const {name, year, author, summary, publisher, pageCount, readPage, reading} =
    request.payload;
  const index = books.findIndex((book) => book.id === bookId);
  const updatedAt = new Date().toISOString();

  const isNameGiven = name !== undefined ? true : false;
  const isReadPageValid = readPage <= pageCount ? true : false;
  const isIdFound = index !== -1 ? true : false;

  if (!isNameGiven) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (!isReadPageValid) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  } else if (!isIdFound) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const {bookId} = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
