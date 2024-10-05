import Issue from "./Issue";

export default function IssueList(props) {
  const { issues } = props;

  const issueElements = issues.map((issue) => {
    return <Issue {...issue} key={issue._id} />;
  });

  return <div>{issueElements}</div>;
}
