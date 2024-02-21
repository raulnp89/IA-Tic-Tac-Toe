function Square(props) {
  let className = "square";
  if (props.value) {
    className += props.value === "X" ? " human" : " ai";
  }
  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}
