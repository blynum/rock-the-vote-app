export default function Issue(props) {
  const { title, description, imgURL } = props;

  return (
    <div>
      <h1>{title}</h1>
      <h4>{description}</h4>
      <img src={imgURL} />
    </div>
  );
}
