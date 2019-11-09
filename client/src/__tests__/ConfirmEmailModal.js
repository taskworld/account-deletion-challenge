import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { toBeDisabled } from "@testing-library/jest-dom";
import ConfirmEmailModal from "../components/ConfirmEmailModal.react";

expect.extend({ toBeDisabled });

test("button should be disabled by default", () => {
  const props = { onBackButton: jest.fn(), email: "ross.example.com", getTransferData: jest.fn(), feedbacks: [] };

  const { getByText } = render(<ConfirmEmailModal {...props} />);

  expect(getByText("Delete my account")).not.toBeNull();
  expect(getByText("Delete my account")).toBeDisabled();
});
