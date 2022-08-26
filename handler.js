const { nanoid } = require("nanoid");
const books = require("./books");

// CREATE
const addBookHandler = (request, h) => {
  // console.log("query = ", request.query);
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  // console.log("name = ", name);
  // if (name) {
  //   console.log("ada");
  // } else {
  //   console.log("ngga");
  // }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  // Jika nama tidak dimasukan
  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);

    return response;
  }

  // Jika readpage>pagecount
  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);

    return response;
  }

  const finished = pageCount === readPage;

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

  const isSuccess = books.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Buku gagal ditambahkan",
  });
  response.code(500);
  return response;
};

// READ
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  // console.log("query = ", !!Number(reading));

  if (name) {
    const book = books.filter(
      (n) =>
        // eslint-disable-next-line implicit-arrow-linebreak, comma-dangle
        n.name.toLowerCase().includes(name.toLowerCase())
      // eslint-disable-next-line function-paren-newline
    );
    const response = h.response({
      status: "success",
      data: {
        books: book.map((x) => ({
          id: x.id,
          name: x.name,
          publisher: x.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  if (reading == 1) {
    const book = books.filter((n) => n.reading === !!Number(reading));
    const response = h.response({
      status: "success",
      data: {
        books: book.map((x) => ({
          id: x.id,
          name: x.name,
          publisher: x.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
  if (reading == 0) {
    const book = books.filter((n) => n.reading === !!Number(reading));
    const response = h.response({
      status: "success",
      data: {
        books: book.map((x) => ({
          id: x.id,
          name: x.name,
          publisher: x.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
  if (finished == 1) {
    const book = books.filter((n) => n.finished === !!Number(finished));
    const response = h.response({
      status: "success",
      data: {
        books: book.map((x) => ({
          id: x.id,
          name: x.name,
          publisher: x.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
  if (finished == 0) {
    const book = books.filter((n) => n.finished === !!Number(finished));
    const response = h.response({
      status: "success",
      data: {
        books: book.map((x) => ({
          id: x.id,
          name: x.name,
          publisher: x.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  // if (request.query) {
  //   let readingz;
  //   const { reading } = request.query;
  //   if (reading == 1) {
  //     readingz = true;
  //   } else {
  //     readingz = false;
  //   }
  //   const book = books.filter((n) => n.reading === readingz);
  //   const response = h.response({
  //     status: "success",
  //     data: {
  //       book,
  //     },
  //   });
  //   response.code(200);
  //   return response;
  // }

  // console.log("book = ", book);
  // console.log("query = ", request.query);
  const response = h.response({
    status: "success",
    data: {
      books: books.map((x) => ({
        id: x.id,
        name: x.name,
        publisher: x.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

// READ BY ID
const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((n) => n.id === id)[0];

  if (book) {
    return {
      status: "success",
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};

// EDIT BY ID
const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((note) => note.id === id);

  if (index !== -1) {
    // Jika nama tidak dimasukan
    if (!name) {
      const response = h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      });
      response.code(400);

      return response;
    }

    // Jika readpage>pagecount
    if (readPage > pageCount) {
      const response = h.response({
        status: "fail",
        message:
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      });
      response.code(400);

      return response;
    }
    const finished = pageCount === readPage;
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

// DELETE
const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((note) => note.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
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
