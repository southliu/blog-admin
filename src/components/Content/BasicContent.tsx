import Forbidden from '@/pages/403';

interface Props {
  isPermission?: boolean;
  children: JSX.Element | JSX.Element[];
}

function BasicContent(props: Props) {
  const { isPermission, children } = props;

  return (
    <>
      {
        isPermission !== false &&
        <div
          id="content"
          className={`
            relative
            box-border
            px-5
            py-3
            rounded-5
          `}
        >
            { children }
        </div>
      }
      {
        isPermission === false &&
        <div className="min-w-980px h-full p-10px box-border overflow-auto">
          <Forbidden />
        </div>
      }
    </>
  );
}

export default BasicContent;
