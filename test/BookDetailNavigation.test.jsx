import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../src/App";

// Mock API response
jest.mock("../api/bookApi", () => ({
  getBookById: jest.fn((id) =>
    Promise.resolve({
      id,
      title: "They Both Die At The End",
      author: "Adam Silvera",
      description: "Dummy description",
      cover: "/covers/they_both_die.jpg",
      recommendations: [
        { id: 101, title: "A Christmas Carol", cover: "/covers/xmas.jpg" },
        { id: 102, title: "Clue", cover: "/covers/clue.jpg" },
      ],
    })
  ),

  fetchAllBooks: jest.fn(() =>
  Promise.resolve({
    books: [
      {
        id: 1,
        title: "They Both Die At The End",
        cover: "/covers/they_both_die.jpg",
      },
    ],
    totalPages: 1,
    })
)
}));

test("navigates to Book Detail when clicking a book", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );

  // Pastikan buku pertama muncul
  const bookCard = await screen.findByText("They Both Die At The End");
  expect(bookCard).toBeInTheDocument();

  // Klik buku
  fireEvent.click(bookCard);

  // Cek apakah sudah pindah ke halaman detail
  const detailTitle = await screen.findByText("They Both Die At The End");
  expect(detailTitle).toBeInTheDocument();

  // Cek apakah deskripsi muncul
  expect(await screen.findByText("Dummy description")).toBeInTheDocument();

  // Cek rekomendasi
  expect(await screen.findByText("A Christmas Carol")).toBeInTheDocument();
  expect(await screen.findByText("Clue")).toBeInTheDocument();
});
