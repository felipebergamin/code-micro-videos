import { Route, Switch } from 'react-router-dom';
import routes from './index';

const AppRouter: React.FC = () => {
  return (
    <Switch>
      {routes.map((route) => (
        <Route key={route.name} {...route} />
      ))}
    </Switch>
  );
};

export default AppRouter;
