import react, { useState } from "react";
import renderer from "react-test-renderer";
import { waitFor } from "@testing-library/react";
import { within } from "@testing-library/dom";
import productDetails from "../../__mockdata__/productDetails.mock.json";
import SelectVariants from "./SelectVariants";

const mockdata = {
  props: {
    variants: productDetails.variants,
    variantData: productDetails.variants_data,
  },
};
function Component(props) {
  const [selection, setSelection] = useState([
    "O1721028057248",
    "O1721035468630",
  ]);
  return (
    <SelectVariants
      {...mockdata.props}
      {...{
        selection,
        setSelection,
      }}
    />
  );
}

describe("SelectVariants", () => {
  const component = renderer.create(<Component />);

  test("Component renders properly", () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("Component should render all variant options", () => {
    waitFor(() => {
      productDetails.variants.forEach((variant) => {
        expect(screen.getByText(variant.name)).toBeInTheDocument();
        variant.options.forEach((option) => {
          expect(screen.getByText(option.name)).toBeInTheDocument();
        });
      });
    });
  });

  test("Color variant options should have color previews", () => {
    let colorVariant = productDetails.variants.filter(
      (variant) => variant.name === "Colour"
    );
    waitFor(() => {
      colorVariant.options.forEach((option) => {
        expect(screen.getByTestId(option.option_id)).toBeInTheDocument();
        expect(screen.getByTestId(option.option_id)).toHaveStyle(
          `background-color: ${option.payload.color}`
        );
      });
    });
  });
});
