export const setPageStyle = (width, height) => {
    console.log("Page dimensions", width, height);
    let styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `@page { size: ${width} ${height}; margin: 0.2rem; }`;
    styleSheet.id = "custom-page-style";
    document.head.appendChild(styleSheet);
  };

export const removePageStyle = () => {
    const styleSheet = document.getElementById("custom-page-style");
    if(styleSheet){
        document.head.removeChild(styleSheet);
    }
}