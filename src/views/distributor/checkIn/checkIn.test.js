import React, { useState } from "react";
import { screen, render } from "@testing-library/react";
import CheckIn from "./checkIn";

const TestComponent = () => {
  const [checkInModal, setCheckInModal] = useState({ open: true, detail: {} });
  return (
    <CheckIn {...{ checkInModal, setCheckInModal }} onchange={jest.fn()} />
  );
};

describe("CheckIn Component", () => {
  const { baseElement } = render(<TestComponent />);
  test("Check In Open", async () => {
    expect(baseElement).toMatchSnapshot();
  });
});
