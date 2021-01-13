import * as React from 'react';
import { connect } from 'react-redux';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import './NavMenu.css';
import { ApplicationState } from '../store';
import * as GlobalsStore from '../store/Globals';

type GlobalProps =
    GlobalsStore.GlobalState
    & typeof GlobalsStore.actionCreators
    & RouteComponentProps<{}>;


class NavMenu extends React.PureComponent<GlobalProps, { isOpen: boolean }> {
    public state = {
        isOpen: false
    };

    public render() {
        return (
             <header>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow mb-3" light>
                    <Container>
                        <NavbarBrand tag={Link} to="/">PixEdit&reg; Cloud</NavbarBrand>
                        <NavbarToggler onClick={this.toggle} className="mr-2"/>
                        <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={this.state.isOpen} navbar>
                            <ul className="navbar-nav flex-grow">
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
                                </NavItem>
                                {
                                    this.props.authToken ?
                                        <NavItem>
                                            <NavLink tag={Link} className="text-dark" to="/process-document">Process Document</NavLink>
                                        </NavItem> : null
                                }
                                {
                                    !this.props.authToken ?
                                        <NavItem>
                                            <NavLink tag={Link} className="text-dark" to="/sign-in">Sign In</NavLink>
                                        </NavItem> : null
                                }
                                {
                                    this.props.authToken ?
                                        <NavItem>
                                            <NavLink tag={Link} className="text-dark" to="/sign-out">Sign Out</NavLink>
                                        </NavItem> : null
                                }
                            </ul>
                        </Collapse>
                    </Container>
                </Navbar>
            </header>
        );
    }

    private toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
}

export default connect(
    (state: ApplicationState) => state.globals,
    GlobalsStore.actionCreators // Selects which action creators are merged into the component's props
)(NavMenu as any);

