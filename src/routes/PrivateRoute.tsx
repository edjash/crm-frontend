import { Route, Redirect, RouteProps } from 'react-router-dom';

interface PrivateRouteProps extends RouteProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: any;
    loggedIn: boolean;
}

const PrivateRoute = (props: PrivateRouteProps) => {
    const { component: Component, loggedIn, ...rest } = props;

    return (
        <Route
            {...rest}
            render={routeProps =>
                loggedIn ? (
                    <Component {...routeProps} />
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                        }}
                    />
                )
            }
        />
    );
};

export default PrivateRoute;
