export default `
.custom-report-layout *[theme] {
    color: #312b81;
  }
  .custom-report-layout *[blur] {
    color: #727176;
  }
  .custom-report-layout *[bold] {
    font-weight: bold;
  }
  .custom-report-layout {
    font-family: "Poppins";
    background-color: #ffffff;
    padding: 24px;
    padding-top: 0px !important;
  }
  .custom-report-layout h2 {
    font-size: 16px;
    font-weight: 600;
    margin: 0px;
  }
  .custom-report-layout h3 {
    font-size: 14px;
    font-weight: 400;
    margin: 0px;
  }
  .custom-report-layout h4 {
    font-size: 12px;
    font-weight: 400;
    margin: 0px;
  }
  .custom-report-layout h5 {
    font-size: 10px;
    font-weight: 400;
    margin: 0px;
  }
  .custom-report-layout p {
    margin: 0;
    font-size:12px;
  }
  .custom-report-layout table,
  .custom-report-layout th,
  .custom-report-layout td {
    border: 1px solid #dddddd;
    border-collapse: collapse;
  }
  .custom-report-layout td {
    padding: 8px;
    overflow-wrap: anywhere;
  }
  .custom-report-layout table[bordered="false"],
  table[bordered="false"] td {
    border: 0px;
    padding: 0px;
  }
  .custom-report-layout .table-layout {
    width: 100%;
    position: relative;
    table-layout: fixed;
  }
  .custom-report-layout .series {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .custom-report-layout .flex1 {
    flex: 1;
  }
  .custom-report-layout .mt {
    margin-top: 6px;
  }
  .custom-report-layout .dashed-border {
    border-top: 1px dashed #dddddd;
  }
  .custom-report-layout .sep {
    font-size: 14px;
    color: #dddddd;
    margin: 0px 4px;
  }
  .custom-report-layout .specs > * {
    line-height: 22px;
  }
  .custom-report-layout .logo {
    position: absolute;
    top: 6px;
    left: 6px;
    max-height: 70px;
    max-width: 120px;
  }
  .custom-report-layout .product-image {
    max-height: 44px;
    max-width: 44px;
    border-radius: 2px;
  }
  .custom-report-layout .marker {
    width: 120px;
    text-align: center;
    font-size: 12px;
    color: #ffffff;
    background-color: #312b81;
    padding: 2px !important;
  }
  .custom-report-layout a {
    color: -webkit-link;
    text-decoration: underline;
  }
  .custom-report-layout .product-list {
    word-break: break-word;
  }
  
`;
