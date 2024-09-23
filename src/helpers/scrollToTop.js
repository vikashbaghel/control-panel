export default function scrollToTop() {
  document.querySelector(".ant-table-body")?.scrollTo(0, 0);
  document.querySelector("#dashboard_layout")?.scrollIntoView();
}
