import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useRouteConfig } from "../hooks/useRouteConfig";
import { ErrorPage, RouterMain } from "../../layout";


function AppRouter() {
  const { childenRoutes } = useRouteConfig();

  const router = createBrowserRouter(
    // delfine method 1
    [
      {
        path: '/',
        element: <RouterMain />,
        // element: <AuthContextProvider><PersistentDrawerLeft /></AuthContextProvider>,
        errorElement: <ErrorPage />,
        //render: () => redirect('./toys'),
        children: childenRoutes,
      },
    ]
  );

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default AppRouter;
