import React,{FC,lazy} from 'react';
import './App.css';
import styles from './App.module.scss'

import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import DocumentTitle from 'react-document-title';

import { createTheme, MuiThemeProvider } from '@material-ui/core/styles';

import TopBar from './components/TopBar/TopBar';
const Products = lazy(() => import('./components/Products/Products'))
const Installment = lazy(() => import('./components/Installments/Installment'))
const Credits = lazy(() => import('./components/Credits/Credits'))
const theme = createTheme({
    palette: {
        primary: {
            main: '#6e00ff'
        },
        secondary: {
            main: '#6e00ff  '
        }
    },
});
const App: FC<Props> = props => {
    return(
        <BrowserRouter>
            <MuiThemeProvider theme={theme}>
                <div className={styles['main-container']}>
                    <TopBar/>
                    <Switch>
                                        <RouteWithTitle exact title="Productos" path="/productos" component={Products} />
                                        <RouteWithTitle exact title="Productos" path="/plazos" component={Installment} />
                                        <RouteWithTitle exact title="Creditos" path="/creditos" component={Credits} />
                                        <Redirect to="/productos" />
                                    </Switch>
                </div>
            </MuiThemeProvider>
                
            </BrowserRouter>
    )
}
const RouteWithTitle = ({ title, render, component: Comp, ...props }: any) => (
    <Route {...props} render={(p) => <DocumentTitle title={title}>{render ? render(p) :
        <Comp {...p} />}</DocumentTitle>} />
);
export default App;
