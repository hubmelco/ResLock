import React from "react";
import { screen } from "@testing-library/react-native";
import Login from "../Login";
import { renderWithRedux } from "../../utils/test-utils";

//This is needed to avoid an error about _beziers? Or something to do with import after tear down IDK. 
//but my brain hurts now and I found the solution on accident when the test randomly worked after I added this
jest.useFakeTimers()

describe("Tests the Login Page", () => {
    it("has a log in button", () => {
        //Will generally always want to render pages with redux
        renderWithRedux(<Login navigation={jest.fn()} route={{params: {org_id: 1}}}/>);
        const button = screen.getByText("Log In");
        expect(button).toBeOnTheScreen()
    });
})