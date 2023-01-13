import './App.css';
import {useAuth, useLoginWithRedirect} from "@frontegg/react";
import {useEffect} from "react";
import {ContextHolder} from "@frontegg/rest-api";
import { gql, useLazyQuery } from '@apollo/client';

const GET_LAUNCHES = gql`
          query Launches {
              launches {
                mission_name
                mission_id
                rocket {
                  rocket_name
                  rocket {
                    company
                    name
                    mass {
                      kg
                    }
                  }
                }
                launch_site {
                  site_name
                }
                launch_date_local
              }
            }
        `;

function drawLaunches(data) {
    console.log('launches - ', data.launches);
    return <div>
        {data.launches.map(launch => (
            <div key={launch.mission_name} className='station'>Launch: {launch.mission_name}</div>
        ))}
    </div>
}

function App() {
    const { user, isAuthenticated } = useAuth();

    const loginWithRedirect = useLoginWithRedirect();const [
        getLaunches,
        { loading: loadingLaunches, data: launches }
    ] = useLazyQuery(GET_LAUNCHES);

    console.log('isAuthenticated - ', isAuthenticated);

    const logout = () => {
        const baseUrl = ContextHolder.getContext().baseUrl;
        window.location.href = `${baseUrl}/oauth/logout?post_logout_redirect_uri=${window.location}`;
    };

    useEffect(() => {
        if (!isAuthenticated) {
            console.log('not authenticated. redirecting to login');
            loginWithRedirect();
        }
    }, [isAuthenticated, loginWithRedirect]);

    return (
        <div className="App">
            {isAuthenticated ? (
                <div>
                    <div>
                        <span>Logged in as: {user?.name}</span>
                    </div>
                    <div>
                        <button onClick={() => alert(user.accessToken)}>What is my access token?</button>
                    </div>
                    <div>
                        {loadingLaunches ? <div>Loading some launches from SpaceX...</div> : <button onClick={() => getLaunches()}>Call my graphql server</button>}
                    </div>
                    <div>
                        <button onClick={() => logout()}>Click to logout</button>
                    </div>
                    {launches ? drawLaunches(launches) : null}
                </div>
            ) : (
                <div>Redirecting to login dialog...</div>
            )}
        </div>
    );
}

export default App;
