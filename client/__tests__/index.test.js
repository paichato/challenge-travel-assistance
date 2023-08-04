import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Home from "../pages/index";
import "@testing-library/jest-dom";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { mockNextRouter } from "../test-utils/mock-next-router";
import { mocked_data } from "../__mocks__/country_data";

async function fetchDataFromEndpoint() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: mocked_data });
    }, 1000);
  });
}

describe("Home", () => {
  jest.useFakeTimers();
  it("should render components, make call, receive results", async () => {
    const router = mockNextRouter({});
    render(
      <RouterContext.Provider value={router}>
        <Home />
      </RouterContext.Provider>
    );

    const input = screen.getByPlaceholderText("search for a city, ex: Maputo");
    const searchButton = screen.getByText("Search");
    fireEvent.change(input, { target: { value: "New York" } });
    fireEvent.click(searchButton);

    const promise = fetchDataFromEndpoint();

    jest.advanceTimersByTime(2000);
    const response = await promise;

    expect(response).toEqual({ data: mocked_data });

    expect(input).toBeInTheDocument();
    expect(input).toBeEmptyDOMElement();
  });
});
