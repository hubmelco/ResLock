import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import Button from "../Button";
import colors from "../../static/colors";

describe("Tests the Component Button", () => {
    it("Displays the passed in title label", () => {
        const label = "test" 
        render(<Button title={label} onPress={jest.fn()}/>);
        // This is an attribute I added to the actual Button component so I could reference it
        const button = screen.getByTestId("button");
        expect(button).toHaveTextContent(label)
    });

    it("Executes the passed in function", () => {
        const mock = jest.fn();
        render(<Button title={"Test"} onPress={mock} />);
        // This is an attribute I added to the actual Button component so I could reference it
        const button = screen.getByTestId("button");

        fireEvent.press(button)
        expect(mock).toBeCalledTimes(1)
    });

    it("Looks like a link", () => {
        render(<Button title={"Test"} onPress={jest.fn()} isLink={true}/>);
        // This is an attribute I added to the actual Button component so I could reference it
        const button = screen.getByTestId("button");
        expect(button.props.style.backgroundColor).toBe("transparent");
        const text = screen.getByText("Test")
        expect(text.props.style.color).toBe(colors.DARK_ORANGE)
        expect(text.props.style.textDecorationLine).toBe("underline");
    });
});