/* eslint-disable camelcase */
/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const baseURL = 'https://us-central1-bookstore-api-e63c8.cloudfunctions.net/bookstoreApi/apps/iVvOr23iYtnzpTzUaVln/books';

const ADD_BOOK = 'bookstore/books/ADD_BOOK';
const REMOVE_BOOK = 'bookstore/books/REMOVE_BOOK';
const GET_BOOKS = 'bookstore/books/GET_BOOKS';

const deleteBook = (state, bookId) => state.filter((book) => book.item_id !== bookId.payload);

const formattedBooks = (response) => Object.entries(response.data).map((arr) => {
  const [item_id, [{ title, author, category }]] = arr;
  return {
    item_id,
    title,
    author,
    category,
  };
});

export const getBooks = createAsyncThunk(GET_BOOKS, async () => {
  const response = await axios.get(baseURL);
  return formattedBooks(response);
});

export const addBook = createAsyncThunk(ADD_BOOK, async (payload) => {
  const {
    item_id, title, author, category,
  } = payload;
  await axios.post(baseURL, {
    item_id,
    title,
    author,
    category,
  });
  return payload;
});

export const removeBook = createAsyncThunk(REMOVE_BOOK, async (item_id) => {
  await axios.delete(`${baseURL}/${item_id}`);
  return item_id;
});

const initialState = {
  books: [],
  status: 'idle',
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getBooks.fulfilled, (state, action) => {
      const states = state;
      states.status = 'success';
      states.books = action.payload;
    });
    builder.addCase(removeBook.fulfilled, (state, action) => {
      const states = state;
      states.status = 'success';
      states.books = deleteBook(states.books, action);
    });
    builder.addCase(addBook.fulfilled, (state, action) => {
      const states = state;
      states.status = 'success';
      states.books = [...states.books, action.payload];
    });
  },
});

export default booksSlice.reducer;
