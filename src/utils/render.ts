import React from 'react';

// https://medium.com/@justynazet/passing-props-to-props-children-using-react-cloneelement-and-render-props-pattern-896da70b24f6
// https://gist.github.com/dandelany/1ff06f4fa1f8d6f89c5e
// https://gist.github.com/dandelany/1ff06f4fa1f8d6f89c5e?permalink_comment_id=3090249#gistcomment-3090249
const recursiveCloneChildren = (
  children: React.ReactElement[],
  newProps: any
): React.ReactElement[] => {
  if (children != null) {
    // console.debug(
    //   `render - newProps: [${JSON.stringify(
    //     newProps
    //   )}], recursiveCloneChildren: `,
    //   children
    // );
    const childrenWithProps = React.Children.map(
      children,
      (child: React.ReactElement) => {
        if (!React.isValidElement(child)) {
          return child;
        }
        // e.g. string has props
        if (child.props) {
          // @ts-ignore
          const childChildrenWithProps = recursiveCloneChildren(
            // @ts-ignore
            child.props.children,
            newProps
          );
          let refinedProps: any = {};
          for (const newPropKey in newProps) {
            const newPropVal = newProps[newPropKey];
            if (newPropVal == null) {
              if (child.props[newPropKey as keyof typeof child.props] != null) {
                refinedProps[newPropKey] = newProps[newPropKey];
              }
            } else {
              refinedProps[newPropKey] = newProps[newPropKey];
            }
          }
          const childrenClone = React.cloneElement(child, {
            ...refinedProps,
            children: childChildrenWithProps,
          });
          return childrenClone;
        }
        return child;
      }
    );
    return childrenWithProps;
  } else {
    return children;
  }
};

export { recursiveCloneChildren };
