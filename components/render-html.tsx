import slugify from 'slugify';

export const RenderHtml = (props: {
  html: string;
  components: Record<string, () => JSX.Element>;
}) => {
  const { html, components } = props;
  const htmlParts = html.split(/<h1 id="[^"]*"[^>]*>([^<]+)<\/h1>/g);

  return (
    <div>
      {htmlParts.map((part, index) => {
        if (index % 2 !== 0) {
          const Component = components[part];
          return Component ? (
            <Component key={index} />
          ) : (
            <h1
              key={index}
              id={slugify(part, {
                lower: true,
                remove: /[*+~.()'"!:@,;]/g,
              })}
            >
              {part}
            </h1>
          );
        } else {
          return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />;
        }
      })}
    </div>
  );
};
