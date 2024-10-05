import Issue from "./Issue";

export default function IssueList(props) {
  const { issues, onDelete, onEdit } = props;

  const issueElements = issues.map((issue) => {
    return (
      <Issue {...issue} key={issue._id} onDelete={onDelete} onEdit={onEdit} />
    );
  });

  return <div>{issueElements}</div>;
}
