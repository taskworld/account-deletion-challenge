import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { toBeDisabled } from "@testing-library/jest-dom";
import ConfirmEmailModal from "../components/ConfirmEmailModal.react";

expect.extend({ toBeDisabled });

const mockJsonPromise = Promise.resolve({});
const mockFetchPromise = Promise.resolve({ json: () => mockJsonPromise });
global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

test("button should be disabled by default", () => {
  const props = { onBackButton: jest.fn(), user: { email: "ross.example.com" }, getTransferData: jest.fn(), feedbacks: [] };

  const { getByText } = render(<ConfirmEmailModal {...props} />);

  expect(getByText("Delete my account")).not.toBeNull();
  expect(getByText("Delete my account")).toBeDisabled();
});

test("should show error when entered wrong email", () => {
  const props = { onBackButton: jest.fn(), user: { email: "ross.example.com" }, getTransferData: jest.fn(), feedbacks: [] };

  const { getByPlaceholderText, getByText } = render(<ConfirmEmailModal {...props} />);

  fireEvent.change(getByPlaceholderText("ross@example.com"), { target: { value: "manish" } });
  fireEvent.click(getByText(/I understand the consequences/));

  expect(getByText("Delete my account")).not.toBeDisabled();
  fireEvent.click(getByText("Delete my account"));
  expect(getByText("Invalid email")).not.toBeNull();
});

test("It should make api request ", () => {
  const mockGetTransferData = jest.fn();
  const props = { onBackButton: jest.fn(), user: { email: "ross@example.com" }, getTransferData: mockGetTransferData, feedbacks: [] };

  const { getByPlaceholderText, getByText } = render(<ConfirmEmailModal {...props} />);

  fireEvent.change(getByPlaceholderText("ross@example.com"), { target: { value: "ross@example.com" } });
  fireEvent.click(getByText(/I understand the consequences/));
  fireEvent.click(getByText("Delete my account"));

  expect(mockGetTransferData).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenCalledTimes(1);
});
