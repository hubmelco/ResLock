import React from "react";
import { render, screen } from '@testing-library/react-native';
import App from "./App";

jest.useFakeTimers();

describe("General App Smoke Test", () => {
    it("has 1 child", () => {
        render(<App/>);
        expect(screen.toJSON().children.length).toBe(1);
    });
});