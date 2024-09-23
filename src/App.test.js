import renderer from "react-test-renderer";
import "@testing-library/jest-dom";
it("Jest works properly", () => {
  const component = renderer.create(<div>hello world</div>);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
