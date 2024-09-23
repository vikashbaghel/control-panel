class Template {
  constructor(state = {}, name = "") {
    this.name = name;
    this.type = "element";
    this.state = {
      element: "",
      props: {},
      style: {},
      children: [],
      statement: "",
      ...state,
    };
  }
  renderItem(item, data) {
    switch (item.type) {
      case "element":
        return item.render(data);
      case "collection":
        return item.render(data[item.name]?.metadata);
      case "filler":
        if (!item.name) {
          item.name = this.name;
        }
        return item.render(data[item.name] || "");
      case "label":
        if (data[this.name]?.label) return data[this.name].value;
        return data[this.name]?.["name"];
      default:
        return item;
    }
  }
  render(data = {}) {
    const { element, props, style, children } = this.state;
    if (element) {
      if (data[this.name]?.status === "hidden") {
        return;
      }
      return `
                <${element}${Object.keys(props)
        .map((k) => ` ${k}="${this.renderItem(props[k], data)}"`)
        .join("")} 
                    style="${Object.keys(style)
                      .map((k) => `${k}:${style[k]}`)
                      .join("; ")}">
                    ${children
                      .map((item) => this.renderItem(item, data))
                      .join("")}
                </${element}>
            `;
    }
    return "";
  }
}

class Collection {
  constructor(name) {
    this.type = "collection";
    this.name = name;
  }
  render(data = []) {
    const resultTemplate = new Template({
      element: "tr",
      children: [
        new Template({
          element: "td",
          children: data.map((child) => {
            return new Template({
              element: "div",
              children: [
                new Template({
                  element: "span",
                  props: {
                    bold: true,
                  },
                  children: [child.name, " : "],
                }),
                child.desc,
              ],
            });
          }),
        }),
      ],
    });

    return resultTemplate.render();
  }
}

class Filler {
  constructor(name) {
    this.type = "filler";
    this.name = name;
  }
  render(value) {
    if (value) {
      return value;
    } else return `{{${this.name}}}`;
  }
}

class Label {
  constructor() {
    this.type = "label";
  }
}

class HtmlTemplate {
  constructor() {
    this.template = `
      <html>
        <head>
          <style>
            %style%
          </style>
        </head>
        <body class="custom-report-layout">
          %body%
        </body>
      </html>
    `;
  }
  render(templates = [], data = {}) {
    templates.map((T) => {
      this.template = this.template.replace(
        "%body%",
        [T.render(data?.labels), "%body%"].join("\n")
      );
    });
    this.template = this.template.replace("%body%", "");
    this.template = this.template.replace("%style%", data?.styles);
    return this.template;
  }
}

export default {
  Template,
  Collection,
  Filler,
  Label,
  HtmlTemplate,
};
