
interface Props {
  children: JSX.Element | JSX.Element[];
}

function BasicCard(props: Props) {
  const { children } = props;

  return (
    <div
      className="min-w-980px h-full p-10px box-border overflow-auto"
    >
      { children }
    </div>
  )
}

export default BasicCard
